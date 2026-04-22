import { Redirect } from 'expo-router';
import React from 'react';

export default function LegacyTabsExploreRedirect() {
  return <Redirect href="/(tabs)/(main)/more" />;
}
