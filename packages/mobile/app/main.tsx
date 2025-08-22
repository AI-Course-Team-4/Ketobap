import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, ScrollView, View, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Notice1 from './notice/notice1';
import Notice2 from './notice/notice2';
import Notice3 from './notice/notice3';
import Notice4 from './notice/notice4';

// 전역 상태로 현재 페이지와 스크롤 위치 저장
let globalCurrentPage = 0;
let globalScrollPosition = 0;

export default function Main() {
    const [fontsLoaded] = useFonts({
        'Jua-Regular': require('../assets/fonts/Jua-Regular.ttf'),
        'NotoSans': require('../assets/fonts/NotoSans-VariableFont.ttf'),
    });

    const [currentPage, setCurrentPage] = useState(globalCurrentPage);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const screenWidth = Dimensions.get('window').width;

    // 컴포넌트가 마운트될 때 이전 스크롤 위치로 복원
    useEffect(() => {
        if (scrollViewRef.current && globalScrollPosition > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: globalScrollPosition,
                    animated: false
                });
            }, 100);
        }
    }, [fontsLoaded]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const pageIndex = Math.round(scrollPosition / screenWidth);

        // 전역 상태 업데이트
        globalCurrentPage = pageIndex;
        globalScrollPosition = scrollPosition;

        setCurrentPage(pageIndex);
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={styles.pageContainer}>
                    <Notice1 currentPage={currentPage} />
                </View>

                <View style={styles.pageContainer}>
                    <Notice2 currentPage={currentPage} />
                </View>

                <View style={styles.pageContainer}>
                    <Notice3 currentPage={currentPage} />
                </View>

                <View style={styles.pageContainer}>
                    <Notice4 currentPage={currentPage} />
                </View>
            </ScrollView>

            {/* Circle Indicators */}
            <View style={styles.circleContainer}>
                {[0, 1, 2, 3].map((index) => (
                    <View
                        key={index}
                        style={[
                            styles.circle,
                            currentPage === index && styles.circleActive
                        ]}
                    />
                ))}
            </View>

            <StatusBar style="auto" />
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    circleContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    circle: {
        width: 15,
        height: 15,
        borderRadius: 15,
        backgroundColor: '#DEE6D1',
    },
    circleActive: {
        backgroundColor: '#90B752'
    },
});

