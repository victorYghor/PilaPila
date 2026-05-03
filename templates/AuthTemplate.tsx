import { BackIcon } from '@/components/icons/BackIcon';
import { ProgressBar } from '@/components/icons/ProgressBar';
import { SubTitle } from '@/components/Texts/SubTitle';
import { Title } from '@/components/Texts/Title';
import { Colors } from '@/constants/colors';
import { BorderRadius, CardPadding, FontSize, Spacing } from '@/constants/metrics';
import React, { ReactElement } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthTemplateProps {
    title: string;
    subtitle?: string;
    progress?: number;
    // boxContent should be a function that receives the current step and returns the content
    boxContent: (step?: number) => ReactElement | undefined;
    step?: number;
    submitError?: string | null;
    loading?: boolean;
    Footer?: React.FC | React.ReactElement;
    ConfirmButton?: React.FC | React.ReactElement;
    onBack?: () => void;
}
export function AuthTemplate(props: AuthTemplateProps) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {props.onBack && (<TouchableOpacity style={styles.backButton} onPress={props.onBack} activeOpacity={0.7}>
                    <BackIcon />
                </TouchableOpacity>)}

                <View style={styles.header}>
                    <Title text={props.title} />
                        { props.subtitle && <SubTitle text={props.subtitle} /> }
                    <View style={styles.progressWrapper}>
                        {props.progress ? (<ProgressBar progress={props.progress} />) : <></>}
                    </View>
                </View>

                <View style={styles.card}>
                    {props.boxContent(props.step)}

                    {/* Submit-level error */}
                    {props.submitError ? (
                        <Text style={styles.submitError}>{props.submitError}</Text>
                    ) : null}
                                            {(() => {
                                                const Confirm = props.ConfirmButton;
                                                if (!Confirm) return null;
                                                return typeof Confirm === 'function' ? React.createElement(Confirm as React.FC) : Confirm;
                                            })()}
                                            {(() => {
                                                const FooterComp = props.Footer;
                                                if (!FooterComp) return null;
                                                return typeof FooterComp === 'function'
                                                    ? React.createElement(FooterComp as React.FC)
                                                    : FooterComp;
                                            })()}
                </View>
            </ScrollView>
        </SafeAreaView>);
}

const styles = StyleSheet.create({
    text: {
        fontSize: FontSize.lg
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.primary400,
    },
    container: {
        flexGrow: 1,
        backgroundColor: Colors.primary400,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xs,
        paddingBottom: Spacing.xl,
        gap: Spacing.xxl,
    },
    header: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: -Spacing.xs,
        marginTop: -Spacing.xs,
        padding: 0,
    },
    progressWrapper: {
        width: '100%',
        alignItems: 'center',
        marginTop: Spacing.sm,
        marginBottom: Spacing.md,
    },
    card: {
        backgroundColor: Colors.cardBackground,
        borderRadius: BorderRadius.lg,
        padding: CardPadding,
        gap: Spacing.lg,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    loginText: {
        color: Colors.textGray,
        fontSize: FontSize.sm,
        lineHeight: FontSize.sm * 1.4,
    },
    fieldError: {
        color: Colors.expenseRed,
        fontSize: FontSize.xs,
        marginTop: Spacing.xs,
    },
    submitError: {
        color: Colors.expenseRed,
        fontSize: FontSize.sm,
        textAlign: 'center',
    },
});