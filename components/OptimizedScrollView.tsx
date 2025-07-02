import React, { useState, useCallback } from 'react';
import { ScrollView, ScrollViewProps, RefreshControl } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface OptimizedScrollViewProps extends ScrollViewProps {
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
}

export function OptimizedScrollView({ 
  children, 
  onRefresh,
  refreshing = false,
  ...props 
}: OptimizedScrollViewProps) {
  const { colors } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onRefresh]);

  return (
    <ScrollView
      {...props}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing || refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}