import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useRef, useCallback, useEffect, useState } from 'react';

type TabParamList = {
    Favorites: undefined;
    Food: undefined;
    Home: undefined;
    Restaurant: undefined;
    Mypage: undefined;
};

type NavigationProp = BottomTabNavigationProp<TabParamList>;

interface Notice4Props {
    currentPage: number;
}

export default function Notice4({ currentPage }: Notice4Props) {
    const navigation = useNavigation<NavigationProp>();
    const titleAnim = useRef(new Animated.Value(0)).current;
    const titleSlideAnim = useRef(new Animated.Value(-100)).current;
    const subtitleAnim = useRef(new Animated.Value(0)).current;
    const subtitleSlideAnim = useRef(new Animated.Value(-100)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const buttonSlideAnim = useRef(new Animated.Value(-100)).current;
    const [isVisible, setIsVisible] = useState(false);

    // currentPage가 3(notice4)일 때 애니메이션 시작
    useEffect(() => {
        if (currentPage === 3) {
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
        buttonAnim.setValue(0);
        buttonSlideAnim.setValue(-10);
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

        // 3. 버튼 애니메이션 (600ms 후) - fade-in + slide-in
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(buttonAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonSlideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start();
        }, 600);
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.titleWrapper, 
                { 
                    opacity: titleAnim,
                    transform: [{ translateY: titleSlideAnim }]
                }
            ]}>
                <Image
                    source={require('../../assets/images/loading_rice_icon.png')}
                    style={styles.leftIcon}
                />
                <Image
                    source={require('../../assets/images/loading_avocado_icon.png')}
                    style={styles.rightIcon}
                />
                <Text style={styles.maintitle}>지금 바로 시작해보세요!</Text>
            </Animated.View>
            <Animated.View style={{ 
                opacity: subtitleAnim,
                transform: [{ translateY: subtitleSlideAnim }]
            }}>
                <Text style={styles.subtitle}>회원가입 없이 바로 사용 가능한 AI 키토 식단 추천</Text>
            </Animated.View>

            <Animated.View style={{ 
                opacity: buttonAnim,
                transform: [{ translateY: buttonSlideAnim }]
            }}>
                <TouchableOpacity
                    style={styles.first_button}
                    onPress={() => {
                        navigation.navigate('Favorites');
                    }}
                >
                    <Text style={styles.button_text}><Text style={{ color: '#fff' }}>식단 추천 받기</Text> <Text style={{ color: '#919E7B' }}>{'>'}</Text></Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.second_button}
                    onPress={() => {
                        navigation.navigate('Restaurant');
                    }}
                >
                    <Text style={styles.button_text}><Text style={{ color: '#819751' }}>강남 맛집 보기</Text> {'>'}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleWrapper: {
        position: 'relative',
        alignItems: 'center',
        width: '100%',
    },
    leftIcon: {
        position: 'absolute',
        left: -30,
        top: -50,
        width: 80,
        height: 80,
        opacity: 0.3,
        zIndex: 1,
        transform: [{ rotate: '-10deg' }],
    },
    rightIcon: {
        position: 'absolute',
        right: -30,
        top: -50,
        width: 80,
        height: 80,
        opacity: 0.3,
        zIndex: 1,
        transform: [{ rotate: '10deg' }],
    },
    maintitle: {
        fontSize: 40,
        fontFamily: 'Jua-Regular',
        textAlign: 'center',
        lineHeight: 50,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'NotoSans',
        textAlign: 'center',
        color: '#658C0F',
        marginBottom: 50,
    },
    button_text: {
        fontSize: 30,
        fontFamily: 'Jua-Regular',
        textAlign: 'center',
    },
    first_button: {
        width: 230,
        backgroundColor: '#ADC883',
        borderRadius: 50,
        borderColor: '#638C04',
        borderWidth: 1,
        padding: 15,
        marginBottom: 20,
        alignSelf: 'center',
    },
    second_button: {
        width: 230,
        backgroundColor: '#F9FEE8',
        borderRadius: 50,
        borderColor: '#638C04',
        borderWidth: 1,
        padding: 15,
        alignSelf: 'center',
    },
});