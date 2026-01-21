import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ZegoUIKitPrebuiltLiveStreaming, {
  HOST_DEFAULT_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import { useAuth } from '../../context/authContext';
import Credential from '../livestreaming/Credential';

const LiveHost = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { username, chatUserID } = useAuth();

  //  values passed from LiveHome
  const { liveId, userName } = route.params || {};

  //  required by Zego (must be STRING)
  const userID = String(chatUserID || Date.now());
  const finalUserName = userName || username || 'Host';

  if (!liveId) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltLiveStreaming
        appID={Credential.appId}
        appSign={Credential.appSign}
        userID={userID}
        userName={finalUserName}
        liveID={String(liveId)}
        config={{
          ...HOST_DEFAULT_CONFIG,

          //  when host leaves live
          onLeaveLiveStreaming: () => {
            navigation.goBack();
          },
        }}
      />
    </View>
  );
};

export default LiveHost;

const styles = StyleSheet.create({
  container: {
   flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
  },
});
