import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Notice3() {
    return (
        <View>
            <Text style={styles.maintitle}>어떻게 작동하나요?</Text>
            <Text style={styles.subtitle}>3단계로 간단하게 시작하세요</Text>

            <View style={styles.firstStep}>
                <Text style={styles.step_number}>01</Text>
                <View style={styles.step_view}>
                    <Text style={styles.step_firstTitle}>선호도 입력</Text>
                    <Text style={styles.step_firstText}>좋아하는 음식, 싫어하는 음식, 알레르기 정보를 입력해주세요</Text>
                </View>
            </View>
            <FontAwesome5 name="arrow-down" size={40} color="#C2CCAA" style={styles.arrow_down} />
            <View style={styles.secondStep}>
                <Text style={styles.step_number}>02</Text>
                <View style={styles.step_view}>
                    <Text style={styles.step_secondTitle}>AI 분석</Text>
                    <Text style={styles.step_secondText}>AI가 당신의 조건에 맞는 키토 친화적인 식단을 분석합니다</Text>
                </View>
            </View>
            <FontAwesome5 name="arrow-down" size={40} color="#C2CCAA" style={styles.arrow_down} />
            <View style={styles.thirdStep}>
                <Text style={styles.step_number}>03</Text>
                <View style={styles.step_view}>
                    <Text style={styles.step_thirdTitle}>추천 완료</Text>
                    <Text style={styles.step_thirdText}>완벽한 키토 식단과 대체 외식 옵션을 추천 받아보세요</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    maintitle: {
        fontSize: 40,
        fontFamily: 'Jua-Regular',
        textAlign: 'center',
        lineHeight: 50,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'NotoSans',
        textAlign: 'center',
        color: '#658C0F',
        marginBottom: 30,
    },
    step_view: {
        padding: 7,
    },
    arrow_down: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    firstStep: {
        backgroundColor: '#97C7EE',
        borderWidth: 1,
        borderColor: '#245D8C',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    step_firstTitle: {
        fontSize: 32,
        fontFamily: 'Jua-Regular',
        color: '#245D8C',
    },
    step_firstText: {
        fontSize: 14,
        fontFamily: 'NotoSans',
        color: '#245D8C',
    },
    secondStep: {
        backgroundColor: '#ACDAAA',
        borderWidth: 1,
        borderColor: '#597358',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    step_secondTitle: {
        fontSize: 32,
        fontFamily: 'Jua-Regular',
        color: '#597358',
    },
    step_secondText: {
        fontSize: 14,
        fontFamily: 'NotoSans',
        color: '#597358',
    },
    thirdStep: {
        backgroundColor: '#E6BD84',
        borderWidth: 1,
        borderColor: '#826338',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    step_thirdTitle: {
        fontSize: 32,
        fontFamily: 'Jua-Regular',
        color: '#826338',
    },
    step_thirdText: {
        fontSize: 14,
        fontFamily: 'NotoSans',
        color: '#826338',
    },
    step_number: {
        fontSize: 55,
        fontFamily: 'Jua-Regular',
        color: '#fff',
        marginRight: 20,
    },
});