import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Notice2() {
    return (
        <View>
            <Text style={styles.maintitle}>
                왜 <Text style={{ color: '#658C0F' }}>KetoBap</Text>을{'\n'} 선택해야 할까요?
            </Text>
            <Text style={styles.subtitle}>AI 기술과 영양학을 결합한 스마트한 키토 다이어트 솔루션</Text>

            <View style={styles.elementsContainer}>
                <View style={styles.element}>
                    <View style={styles.elementIcon}>
                        <FontAwesome5 name="brain" size={50} color="#007EFF" />
                    </View>
                    <Text style={styles.elementTitle}>AI 맞춤 추천</Text>
                    <Text style={styles.elementText}>개인의 선호도와 알레르기를 고려한 똑똑한 키토 식단 추천</Text>
                </View>
                <View style={styles.element}>
                    <View style={styles.elementIcon}>
                        <FontAwesome5 name="utensils" size={50} color="#187C29" />
                    </View>
                    <Text style={styles.elementTitle}>영양 분석</Text>
                    <Text style={styles.elementText}>탄수화물·단백질·지방 비율과 키토 점수를 실시간으로 분석하여 제공</Text>
                </View>
                <View style={styles.element}>
                    <View style={styles.elementIcon}>
                        <FontAwesome5 name="map-marker-alt" size={50} color="#FFAA23" />
                    </View>
                    <Text style={styles.elementTitle}>외식 가이드</Text>
                    <Text style={styles.elementText}>강남 지역 키토 친화적인 음식점과 메뉴 추천</Text>
                </View>
                <View style={styles.element}>
                    <View style={styles.elementIcon}>
                        <FontAwesome5 name="star" size={50} color="#8E53B4" />
                    </View>
                    <Text style={styles.elementTitle}>간편한 사용</Text>
                    <Text style={styles.elementText}>회원가입 없이도 바로 사용 가능한 직관적인 인터페이스</Text>
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
    elementsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    element: {
        backgroundColor: '#E7EEDC',
        borderWidth: 1,
        borderColor: '#BAC3AB',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        paddingLeft: 20,
        width: '48%',
        marginBottom: 15,
    },
    elementIcon: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 23,
    },
    elementTitle: {
        fontSize: 24,
        fontFamily: 'Jua-Regular',
        color: '#3E5703',
        textAlign: 'center',
        marginBottom: 8,
    },
    elementText: {
        fontSize: 13,
        fontFamily: 'NotoSans',
        color: '#819751',
        textAlign: 'center',
    },
});