
import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  ScrollView,
} from "react-native";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, googleProvider } from "./src/firebase";

// Local development testing account only
const TEST_EMAIL = "ajay1223tiwari@gmail.com";

const isAuthorizedEmail = (email) => {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  const isTestEmail =
    __DEV__ && normalizedEmail === TEST_EMAIL;

  const isCompanyEmail =
    normalizedEmail.endsWith("@hbplus.fit");

  return isTestEmail || isCompanyEmail;
};

export default function App() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Firebase session listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            setUser(null);
            return;
          }

          const userEmail =
            firebaseUser.email?.trim().toLowerCase();

          if (!isAuthorizedEmail(userEmail)) {
            setUser(null);
            await signOut(auth);
            return;
          }

          setUser({
            email: userEmail,
            name: firebaseUser.displayName || "HB+ User",
          });

        } catch (err) {
          console.error("Session check error:", err);
          setUser(null);
          setError("Unable to verify your login session.");
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const showMessage = (message) => {
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert("HB+", message);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");

    const enteredEmail = email.trim().toLowerCase();

    if (!enteredEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!isAuthorizedEmail(enteredEmail)) {
      setError(
        "Only @hbplus.fit email addresses are allowed."
      );
      return;
    }

    if (Platform.OS !== "web") {
      showMessage(
        "Mobile Google login needs native authentication configuration."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const googleEmail =
        result.user.email?.trim().toLowerCase();

      // Verify actual Google account
      if (!isAuthorizedEmail(googleEmail)) {
        await signOut(auth);
        throw new Error(
          "Only @hbplus.fit email addresses are allowed."
        );
      }

      // Verify entered email and Google email match
      if (googleEmail !== enteredEmail) {
        await signOut(auth);
        throw new Error(
          "Google account does not match the entered email."
        );
      }

      setUser({
        email: googleEmail,
        name: result.user.displayName || "HB+ User",
      });

    } catch (err) {
      console.error("Google login error:", err);

      setError(
        err?.message || "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setLoading(true);

      await signOut(auth);

      setUser(null);
      setEmail("");
      setError("");

    } catch (err) {
      console.error("Logout error:", err);

      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>HB+</Text>
        <ActivityIndicator
          size="large"
          color="#1769e0"
        />
        <Text style={styles.loadingText}>
          Checking your account...
        </Text>
      </View>
    );
  }

  // Dashboard
  if (user) {
    return (
      <View style={styles.dashboardContainer}>
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardLogo}>HB+</Text>

          <Pressable
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.dashboardScroll}
        >
          <View style={styles.dashboardContent}>
            <Text style={styles.welcomeText}>
              Welcome back,
            </Text>

            <Text style={styles.userName}>
              {user.name}
            </Text>

            <Text style={styles.dashboardSubtitle}>
              Here's your account overview.
            </Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                Account Information
              </Text>

              <Text style={styles.infoLabel}>
                Email Address
              </Text>

              <Text style={styles.infoValue}>
                {user.email}
              </Text>

              <Text style={styles.infoLabel}>
                Account Status
              </Text>

              <Text style={styles.activeStatus}>
                Active
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                Dashboard Overview
              </Text>

              <Text style={styles.overviewText}>
                You have successfully logged in to HB+.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Login screen
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>HB+</Text>

        <Text style={styles.heading}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Sign in with your official HB+ account
        </Text>

        <Text style={styles.label}>
          Work Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="name@hbplus.fit"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        <Pressable
          style={[
            styles.button,
            loading && styles.disabled,
          ]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Continue with Google
            </Text>
          )}
        </Pressable>

        <Text style={styles.footer}>
          Only authorized @hbplus.fit accounts can
          access this application.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1769e0",
    textAlign: "center",
    marginBottom: 20,
  },

  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#172033",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#667085",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 9,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    color: "#172033",
  },

  button: {
    backgroundColor: "#1769e0",
    padding: 15,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 10,
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  error: {
    color: "#d92d20",
    fontSize: 13,
    marginBottom: 8,
  },

  footer: {
    color: "#667085",
    fontSize: 12,
    textAlign: "center",
    marginTop: 22,
    lineHeight: 18,
  },

  loadingText: {
    color: "#667085",
    marginTop: 15,
    fontSize: 14,
  },

  dashboardContainer: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    width: "100%",
  },

  dashboardHeader: {
    backgroundColor: "#ffffff",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },

  dashboardLogo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1769e0",
  },

  logoutButton: {
    backgroundColor: "#1769e0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  logoutText: {
    color: "#ffffff",
    fontWeight: "600",
  },

  dashboardScroll: {
    flexGrow: 1,
  },

  dashboardContent: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 24,
  },

  welcomeText: {
    fontSize: 18,
    color: "#667085",
  },

  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#172033",
    marginTop: 5,
  },

  dashboardSubtitle: {
    color: "#667085",
    marginTop: 8,
    marginBottom: 25,
  },

  infoCard: {
    backgroundColor: "#ffffff",
    padding: 22,
    borderRadius: 14,
    marginBottom: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#172033",
    marginBottom: 18,
  },

  infoLabel: {
    color: "#667085",
    fontSize: 13,
    marginTop: 10,
  },

  infoValue: {
    color: "#172033",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 5,
  },

  activeStatus: {
    color: "#16803c",
    fontWeight: "bold",
    marginTop: 5,
  },

  overviewText: {
    color: "#475467",
    fontSize: 14,
  },
});
