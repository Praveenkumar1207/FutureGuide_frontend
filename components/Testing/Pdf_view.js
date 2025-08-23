import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ResumeViewer = ({navigation,route}) => {
    const {fileUrl} = route.params || {};
    // useEffect(()=>{
    //     navigation.setoptions({
    //         headerShown: true,
    //         title: 'Resume Viewer',
    //         headerStyle: {
    //             backgroundColor: '#f4511e',
    //         },
    //     });
    // },[])
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: `https://docs.google.com/gview?embedded=true&url=${fileUrl}` }}
                style={styles.webview}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    webview: { flex: 1 }
});

export default ResumeViewer;
