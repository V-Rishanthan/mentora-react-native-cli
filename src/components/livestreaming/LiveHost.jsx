import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ZegoUIKitPrebuiltLiveStreaming, { HOST_DEFAULT_CONFIG } from "@zegocloud/zego-uikit-prebuilt-live-streaming-rn";
import Credential from "../livestreaming/Credential";
import { useAuth } from "../../context/authContext";

async function requestCamMic() {
  if (Platform.OS !== "android") return true;

  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ]);

  return (
    result[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
    result[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED
  );
}

export default function LiveHost() {
  const route = useRoute();
  const navigation = useNavigation();
  const { username, chatUserID, user } = useAuth();
  const { liveId } = route.params || {};

  const userID = useMemo(() => String(user?.uid || chatUserID || Date.now()), [user?.uid, chatUserID]);
  const userName = username || "Host";
  console.log(" 😍😍 Hoster userName :",userName)

  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await requestCamMic();
      setReady(ok);
    })();
  }, []);

  if (!liveId) return <View style={styles.center}><Text>Live ID missing</Text></View>;
  if (!ready) return <View style={styles.center}><Text>Please allow Camera + Microphone</Text></View>;

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltLiveStreaming
        appID={Credential.appId}
        appSign={Credential.appSign}
        userID={userID}
        userName={userName}
        liveID={liveId}
        config={{
          ...HOST_DEFAULT_CONFIG,

          //  force camera/mic ON when joining
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,

          onLeaveLiveStreaming: () => navigation.goBack(),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
