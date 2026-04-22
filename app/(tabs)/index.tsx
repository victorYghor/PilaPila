import { Redirect } from 'expo-router';
import React from 'react';

export default function LegacyTabsIndexRedirect() {
  return <Redirect href="/(tabs)/(main)" />;
}
