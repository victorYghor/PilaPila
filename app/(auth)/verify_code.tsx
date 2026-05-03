import { PilaPilaButton } from "@/components/Buttons/Button";
import { verifycode } from "@/service/AuthService";
import { AuthTemplate } from "@/templates/AuthTemplate";
import { router } from "expo-router";
import React from "react";
import { TextInput } from "react-native";
import { useAuth } from "../providers/Authcontext";


export function VerifyCodeScreen() {
    const [code, setCode] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const { emailOfReset } = useAuth();
    async function handleConfirm() {
        setLoading(true);
        const userEmail = await verifycode(code);
        setLoading(false);
        if (emailOfReset && userEmail === emailOfReset) {
            router.push("/(auth)/reset_password")
        } else {
            setError("Tem algum problema com seu Email ou código.");
        }
    }
    return (
        <AuthTemplate
            title={"Digite o código de verificação"}
            subtitle={"Enviamos um código para seu e-mail."}
            boxContent={
                () => <TextInput value={code} placeholder="código de verificação" onChangeText={setCode} />
            }
            submitError={error}
            loading={loading}
            ConfirmButton={<PilaPilaButton label="Confirmar" onPress={handleConfirm} />}
        />
    );
}