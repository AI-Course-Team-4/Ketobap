import { View, Text, Image, StyleSheet } from 'react-native';

export default function Notice1() {
    return (
        <View style={styles.main_container}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.main_logo}
            />
            <Text style={styles.main_subtitle}>AI 키토 식단 추천</Text>
            <View style={styles.main_minititleDiv}>
                <Text style={styles.main_minititle}>AI 기반 키토 다이어트 도우미</Text>
            </View>
            <Text style={styles.main_maintitle}>
                당신만의 <Text style={{ color: '#658C0F' }}>키토 식단</Text>을{'\n'}
                AI가 추천해드려요
            </Text>
            <Text style={{ lineHeight: 20, color: '#3E5703', textAlign: 'center', marginBottom: 100 }}>
                개인 선호도, 알레르기, 비선호 식품을 고려하여{'\n'}
                완벽한 키토 식단과 강남 맛집을 추천받으세요
            </Text>
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
        fontSize: 13,
    },
    main_maintitle: {
        fontFamily: 'Jua-Regular',
        fontSize: 40,
        textAlign: 'center',
        marginBottom: 9,
        lineHeight: 50,
    },
});