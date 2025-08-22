import { View, Text, Image, StyleSheet } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';

interface Notice1Props {
    currentPage: number;
}

export default function Notice1({ currentPage }: Notice1Props) {
    const titleAnim = useRef(new Animated.Value(0)).current;
    const titleSlideAnim = useRef(new Animated.Value(-100)).current;
    const subtitleAnim = useRef(new Animated.Value(0)).current;
    const subtitleSlideAnim = useRef(new Animated.Value(-100)).current;
    const elementsAnim = useRef(new Animated.Value(0)).current;
    const elementsSlideAnim = useRef(new Animated.Value(-100)).current;
    const [isVisible, setIsVisible] = useState(false);

    // currentPage가 0(notice1)일 때 애니메이션 시작
    useEffect(() => {
        if (currentPage === 0) {
            setIsVisible(true);
            startSequentialAnimation();
        } else {
            setIsVisible(false);
            resetAnimations();
        }
    }, [currentPage]);

    // 애니메이션 초기화 함수
    const resetAnimations = () => {
        titleAnim.setValue(0);
        titleSlideAnim.setValue(-10);
        subtitleAnim.setValue(0);
        subtitleSlideAnim.setValue(-10);
        elementsAnim.setValue(0);
        elementsSlideAnim.setValue(-10);
    };

    // 순차적 애니메이션 시작 함수
    const startSequentialAnimation = () => {
        resetAnimations();

        // 1. 제목 애니메이션 (0ms) - fade-in + slide-in
        Animated.parallel([
            Animated.timing(titleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(titleSlideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();

        // 2. 부제목 애니메이션 (300ms 후) - fade-in + slide-in
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(subtitleAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(subtitleSlideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start();
        }, 300);

        // 3. 요소 애니메이션 (600ms 후) - fade-in + slide-in
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(elementsAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(elementsSlideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start();
        }, 600);
    };

    return (
        <View style={styles.main_container}>
            <Animated.View style={{
                opacity: titleAnim,
                transform: [{ translateY: titleSlideAnim }],
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.main_logo}
                />
                <Text style={styles.main_subtitle}>AI 키토 식단 추천</Text>
            </Animated.View>

            <Animated.View style={{
                opacity: subtitleAnim,
                transform: [{ translateY: subtitleSlideAnim }],
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={styles.main_minititleDiv}>
                    <Text style={styles.main_minititle}>AI 기반 키토 다이어트 도우미</Text>
                </View>
                <Text style={styles.main_maintitle}>
                    당신만의 <Text style={{ color: '#658C0F' }}>키토 식단</Text>을{'\n'}
                    AI가 추천해드려요
                </Text>
            </Animated.View>

            <Animated.View style={{
                opacity: elementsAnim,
                transform: [{ translateY: elementsSlideAnim }],
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{ lineHeight: 30, color: '#3E5703', textAlign: 'center', marginBottom: 100, fontSize: 18, }}>
                    개인 선호도, 알레르기, 비선호 식품을 고려하여{'\n'}
                    완벽한 키토 식단과 강남 맛집을 추천받으세요
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // 함수형 스타일로 계산
    main_logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain', // 원본 비율 유지
        marginBottom: -15,
    },
    main_subtitle: {
        color: '#3E5703',
        fontFamily: 'NotoSans',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 60,
    },
    main_minititleDiv: {
        backgroundColor: '#D7E9BB',
        width: 173,
        height: 33,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginBottom: 23,
    },
    main_minititle: {
        color: '#3E5703',
        fontFamily: 'NotoSans',
        fontSize: 15,
    },
    main_maintitle: {
        fontFamily: 'Jua-Regular',
        fontSize: 40,
        textAlign: 'center',
        marginBottom: 9,
        lineHeight: 50,
    },
});