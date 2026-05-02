import { Colors } from "@/constants/colors";
import { FontSize, Spacing } from "@/constants/metrics";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function PasswordRules({ password, minPasswordLength}: { password: string, minPasswordLength: number}) {

    const rules: { label: string; ok: boolean }[] = [
        { label: 'Mínimo 8 caracteres', ok: password.length >= minPasswordLength },
        { label: 'Uma letra maiúscula', ok: /[A-Z]/.test(password) },
        { label: 'Um número', ok: /[0-9]/.test(password) },
    ];

    return (
        <View style={styles.rulesWrapper}>
            {rules.map(r => (
                <Text
                    key={r.label}
                    style={[styles.ruleText, r.ok ? styles.ruleOk : styles.rulePending]}
                >
                    {r.ok ? '✓' : '○'} {r.label}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    rulesWrapper: {
        gap: 4,
        marginTop: -Spacing.xs,
    },
    ruleText: {
        fontSize: FontSize.xs,
        lineHeight: FontSize.xs * 1.6,
    },
    ruleOk: {
        color: Colors.darkGreen,
    },
    rulePending: {
        color: Colors.black,
    },
},)
