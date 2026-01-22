import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Credential from "../livestreaming/Credential";
import { useAuth } from "../../context/authContext";
import ZegoUIKitPrebuiltVideoConference from "@zegocloud/zego-uikit-prebuilt-video-conference-rn";

async function requestCamMic() {
  if (Platform.OS !== "android") return true;

  const grants = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ]);

  const cameraGranted =
    grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
    PermissionsAndroid.RESULTS.GRANTED;

  const micGranted =
    grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
    PermissionsAndroid.RESULTS.GRANTED;

  return cameraGranted && micGranted;
}

export default function LiveHost() {
  const route = useRoute();
  const navigation = useNavigation();
  const { username, chatUserID, user } = useAuth();

  //  accept liveId (old param) OR conferenceID (new param)
  const { liveId, conferenceID } = route.params || {};

  //  final room id for video conference
  const roomId = String(conferenceID || liveId || "").trim();

  const userID = useMemo(
    () => String(user?.uid || chatUserID || Date.now()),
    [user?.uid, chatUserID]
  );

  const userName = username || "Host";

  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await requestCamMic();
      setReady(ok);
    })();
  }, []);

  if (!roomId) {
    return (
      <View style={styles.center}>
        <Text>Conference ID missing</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text>Please allow Camera & Microphone</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltVideoConference
        appID={Credential.appId}
        appSign={Credential.appSign}
        userID={userID}
        userName={userName}
        conferenceID={roomId}   //  use liveId as conferenceID
        config={{
          onLeave: () => navigation.goBack(),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
