import { View, Text, StyleSheet, Image } from 'react-native';

export default function Notice4() {
    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <Image
                    source={require('../../assets/images/loading_rice_icon.png')}
                    style={styles.leftIcon}
                />
                <Image
                    source={require('../../assets/images/loading_avocado_icon.png')}
                    style={styles.rightIcon}
                />
                <Text style={styles.maintitle}>지금 바로 시작해보세요!</Text>
            </View>
            <Text style={styles.subtitle}>회원가입 없이 바로 사용 가능한 AI 키토 식단 추천</Text>

            <View style={styles.first_button}>
                <Text style={styles.button_text}><Text style={{color: '#fff'}}>식단 추천 받기</Text> <Text style={{color: '#919E7B'}}>{'>'}</Text></Text>
            </View>

            <View style={styles.second_button}>
                <Text style={styles.button_text}><Text style={{color: '#819751'}}>강남 맛집 보기</Text> {'>'}</Text>
            </View>
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
        marginBottom: 20,
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
        fontSize: 16,
        fontFamily: 'NotoSans',
        textAlign: 'center',
        color: '#658C0F',
        marginBottom: 30,
    },
    button_text: {
        fontSize: 32,
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