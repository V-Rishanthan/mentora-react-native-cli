

import React, { useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ZegoUIKitPrebuiltLiveStreaming, {
  AUDIENCE_DEFAULT_CONFIG,
} from "@zegocloud/zego-uikit-prebuilt-live-streaming-rn";
import Credential from "../livestreaming/Credential";
import { useAuth } from "../../context/authContext";

const AudienceLive = () => {
  const { username, chatUserID, user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();

  const params = route?.params || {};
  const liveId = params.liveId || params.liveID || params.hostLiveId || "";

  const userID = useMemo(() => {
    if (user?.uid) return String(user.uid);
    if (chatUserID) return String(chatUserID);
    return String(Date.now());
  }, [user?.uid, chatUserID]);

  const finalUserName = params.userName || username || "Audience";

  if (!liveId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Live ID not found. Go back and enter a Live ID.
        </Text>
      </View>
    );
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
          ...AUDIENCE_DEFAULT_CONFIG,
          onLeaveLiveStreaming: async () => {
            try {
              if (navigation.canGoBack()) navigation.goBack();
              else navigation.navigate("LiveHome"); 
            } catch (e) {
              console.log("Leave live error:", e);
            }
          },
        }}
      />
    </View>
  );
};

export default AudienceLive;

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
});

