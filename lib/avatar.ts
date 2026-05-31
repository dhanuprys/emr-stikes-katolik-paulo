import avatarL0_5 from "@/components/assets/avatars/L_0-5.jpeg";
import avatarL6_11 from "@/components/assets/avatars/L_6-11.jpeg";
import avatarL12_17 from "@/components/assets/avatars/L_12-17.jpeg";
import avatarL18_35 from "@/components/assets/avatars/L_18-35.jpeg";
import avatarL36_59 from "@/components/assets/avatars/L_36-59.jpeg";
import avatarL60 from "@/components/assets/avatars/L_60.jpeg";

import avatarP0_5 from "@/components/assets/avatars/P_0-5.jpeg";
import avatarP6_11 from "@/components/assets/avatars/P_6-11.jpeg";
import avatarP12_17 from "@/components/assets/avatars/P_12-17.jpeg";
import avatarP18_35 from "@/components/assets/avatars/P_18-35.jpeg";
import avatarP36_59 from "@/components/assets/avatars/P_36-59.jpeg";
import avatarP60 from "@/components/assets/avatars/P_60.jpeg";

export function getDefaultAvatar(gender: string, umurStr: string) {
  // Extract the first number found in the umur string (e.g. "85 thn 6 bln" -> 85)
  const match = umurStr.match(/\d+/);
  const age = match ? parseInt(match[0], 10) : 0;
  
  if (gender === "L") {
    if (age <= 5) return avatarL0_5.src;
    if (age <= 11) return avatarL6_11.src;
    if (age <= 17) return avatarL12_17.src;
    if (age <= 35) return avatarL18_35.src;
    if (age <= 59) return avatarL36_59.src;
    return avatarL60.src;
  } else {
    if (age <= 5) return avatarP0_5.src;
    if (age <= 11) return avatarP6_11.src;
    if (age <= 17) return avatarP12_17.src;
    if (age <= 35) return avatarP18_35.src;
    if (age <= 59) return avatarP36_59.src;
    return avatarP60.src;
  }
}
