import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
    auth,
    db,
    googleProvider,
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs
} from "../lib/firebase";

interface AuthContextType {
    currentUser: any;
    userProfile: any;
    userData: any;
    authLoading: boolean;
    theme: string;
    toggleTheme: () => void;
    rageScore: number;
    login: (e: string, p: string) => Promise<any>;
    signup: (e: string, p: string, n: string) => Promise<any>;
    loginWithGoogle: (nav: any) => Promise<void>;
    logout: (nav: any) => Promise<void>;
    completeOnboarding: (uid: string, data: any) => Promise<void>;
    checkUsername: (username: string) => Promise<boolean>;
    saveItem: (uid: string, coll: string, id: string | number, data: any) => Promise<void>;
    deleteItem: (uid: string, coll: string, id: string | number) => Promise<void>;
    updateProfile: (uid: string, fields: any) => Promise<void>;
    quote: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // UI STATE
    const [theme, setTheme] = useState(() => localStorage.getItem('ro_theme') || 'dark');
    const quote = "You don't rise to the level of your goals. You fall to the level of your systems.";

    useEffect(() => {
        localStorage.setItem('ro_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

    // RAGE SCORE Calculation (World Class)
    const rageScore = useMemo(() => {
        if (!userData) return 0;
        const studyPts = (userData.sessions || []).reduce((acc: number, s: any) => acc + (s.secs || 0), 0) / 360;
        const goalPts = (userData.goals || []).filter((g: any) => g.done).length * 100;
        const habitPts = (userData.habits || []).length * 10;
        return Math.min(1000, Math.floor(studyPts + goalPts + habitPts));
    }, [userData]);

    const profileRef = (uid: string) => doc(db, "users", uid, "profile", "data");

    const loadAllData = async (uid: string) => {
        const collections = ['sessions', 'habits', 'goals', 'vault', 'feed', 'aiChats', 'timetable'];
        const results = await Promise.all(
            collections.map(c => getDocs(collection(db, "users", uid, c)))
        );

        const data: any = {};
        collections.forEach((name, i) => {
            data[name] = results[i].docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
        return data;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const profileSnap = await getDoc(profileRef(user.uid));
                    if (profileSnap.exists()) {
                        const profile = profileSnap.data();
                        setUserProfile(profile);
                        if (profile.onboardingComplete) {
                            const data = await loadAllData(user.uid);
                            setUserData(data);
                        }
                    }
                } catch (err) {
                    console.error("Error loading user data:", err);
                }
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                setUserData(null);
            }
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email: string, password: string, name: string) => {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const profile = {
            uid: res.user.uid,
            name,
            email,
            avatar: name[0].toUpperCase(),
            createdAt: new Date().toISOString(),
            onboardingComplete: false,
            rageScore: 0,
            level: "Spark"
        };
        await setDoc(profileRef(res.user.uid), profile);
        setUserProfile(profile);
        return res;
    };

    const login = (email: string, password: string) =>
        signInWithEmailAndPassword(auth, email, password);

    const loginWithGoogle = async (navigate: any) => {
        const res = await signInWithPopup(auth, googleProvider);
        const profileSnap = await getDoc(profileRef(res.user.uid));

        if (profileSnap.exists()) {
            const profile = profileSnap.data();
            setUserProfile(profile);
            if (profile.onboardingComplete) {
                const data = await loadAllData(res.user.uid);
                setUserData(data);
                navigate("/app");
            } else {
                navigate("/onboarding");
            }
        } else {
            const profile = {
                uid: res.user.uid,
                name: res.user.displayName || "",
                email: res.user.email,
                avatar: (res.user.displayName?.[0] || 'R').toUpperCase(),
                createdAt: new Date().toISOString(),
                onboardingComplete: false,
                rageScore: 0,
                level: "Spark"
            };
            await setDoc(profileRef(res.user.uid), profile);
            setUserProfile(profile);
            navigate("/onboarding");
        }
    };

    const logout = async (navigate: any) => {
        await signOut(auth);
        navigate("/auth");
    };

    const checkUsername = async (username: string) => {
        const snap = await getDoc(doc(db, "usernames", username.toLowerCase()));
        return !snap.exists();
    };

    const completeOnboarding = async (uid: string, data: any) => {
        if (data.username) {
            await setDoc(doc(db, "usernames", data.username.toLowerCase()), { uid });
        }
        const finalProfile = { ...userProfile, ...data, onboardingComplete: true };
        await updateDoc(profileRef(uid), finalProfile);
        setUserProfile(finalProfile);
        const allData = await loadAllData(uid);
        setUserData(allData);
    };

    const saveItem = async (uid: string, coll: string, id: string | number, data: any) => {
        await setDoc(doc(db, "users", uid, coll, id.toString()), {
            ...data,
            updatedAt: new Date().toISOString()
        });
        setUserData((prev: any) => ({
            ...prev,
            [coll]: [
                ...(prev?.[coll] || []).filter((item: any) => item.id !== id),
                { ...data, id }
            ]
        }));
    };

    const deleteItem = async (uid: string, coll: string, id: string | number) => {
        await deleteDoc(doc(db, "users", uid, coll, id.toString()));
        setUserData((prev: any) => ({
            ...prev,
            [coll]: (prev?.[coll] || []).filter((item: any) => item.id !== id)
        }));
    };

    const updateProfile = async (uid: string, fields: any) => {
        await updateDoc(profileRef(uid), fields);
        setUserProfile((prev: any) => ({ ...prev, ...fields }));
    };

    return (
        <AuthContext.Provider value={{
            currentUser, userProfile, userData, authLoading,
            theme, toggleTheme, rageScore, quote,
            login, signup, loginWithGoogle, logout,
            completeOnboarding, checkUsername, saveItem, deleteItem, updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}
