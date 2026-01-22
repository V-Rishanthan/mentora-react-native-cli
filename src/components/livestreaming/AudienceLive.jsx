import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ZegoUIKitPrebuiltVideoConference from "@zegocloud/zego-uikit-prebuilt-video-conference-rn";
import Credential from "../livestreaming/Credential";
import { useAuth } from "../../context/authContext";

/**
 * Request Camera & Microphone permission (Android)
 */
async function requestCamMic() {
  if (Platform.OS !== "android") return true;

  const grants = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ]);

  const camOk =
    grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
    PermissionsAndroid.RESULTS.GRANTED;

  const micOk =
    grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
    PermissionsAndroid.RESULTS.GRANTED;

  return camOk && micOk;
}

export default function AudienceLive() {
  const { username, chatUserID, user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();

  const params = route?.params || {};

  //  Accept many possible param keys (so you won't get "ID missing")
  const rawConferenceId =
    params.conferenceID ||
    params.conferenceId ||
    params.roomId ||
    params.roomID ||
    params.liveId ||
    params.liveID ||
    params.hostLiveId ||
    params.hostLiveID ||
    "";

  const conferenceID = String(rawConferenceId).trim();

  //  Debug: see what you really received
  console.log(" 💕💕💕💕😁😁😁😁😁😁VideoConferenceAudience route.params:", params);
  console.log("💕💕💕💕💕💕🤣🤣🤣🤣 VideoConferenceAudience conferenceID:", conferenceID);

  const userID = useMemo(() => {
    if (user?.uid) return String(user.uid);
    if (chatUserID) return String(chatUserID);
    return String(Date.now());
  }, [user?.uid, chatUserID]);

  const userName = params.userName || username || "Participant";

  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await requestCamMic();
      setReady(ok);
    })();
  }, []);

  if (!conferenceID) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Conference ID not found. Go back and enter a Conference ID.
        </Text>
        <Text style={styles.smallText}>
          (Tip: Pass conferenceID or liveId when navigating)
        </Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Please allow Camera & Microphone</Text>
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
        conferenceID={conferenceID}
        config={{
          onLeave: () => {
            try {
              if (navigation.canGoBack()) navigation.goBack();
              else navigation.navigate("Home");
            } catch (e) {
              console.log("Leave conference error:", e);
            }
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  errorText: { color: "white", fontSize: 16, textAlign: "center" },
  smallText: { color: "gray", fontSize: 12, marginTop: 8, textAlign: "center" },
});
