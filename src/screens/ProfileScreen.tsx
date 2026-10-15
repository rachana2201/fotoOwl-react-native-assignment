import { useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import { FormLayout } from "../components/AuthLayout";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Dropdown } from "../components/Dropdown";
import { Input } from "../components/Input";
import { RadioGroup } from "../components/RadioGroup";
import { DownloadFeedbackModal } from "../components/DownloadFeedbackModal";
import { AVATARS, CITIES, GENDERS } from "../constants";
import { useForm } from "../hooks/useForm";
import { useTheme, useThemedStyles } from "../hooks/useTheme";
import { useAuthStore } from "../store/authStore";
import { radius, type Colors } from "../theme";
import type { User } from "../types";
import { validateProfile, type ProfileForm } from "../utils/validation";

const factory = (c: Colors) => ({
  header: { alignItems: "center" as const, marginBottom: 20, gap: 8 },
  name: { color: c.text, fontSize: 22, fontWeight: "800" as const },
  email: { color: c.textMuted, fontSize: 14 },
  card: {
    backgroundColor: c.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 16,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  infoLabel: { color: c.textMuted, fontSize: 12, marginBottom: 2 },
  infoValue: { color: c.text, fontSize: 16, fontWeight: "600" as const },
  themeRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 12,
  },
  themeLabel: { color: c.text, fontSize: 16, fontWeight: "600" as const },
  sectionLabel: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  avatarGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
    marginBottom: 16,
  },
  avatarOption: {
    padding: 3,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "transparent",
  },
  avatarSelected: { borderColor: c.primary },
  buttons: { gap: 12, marginTop: 20 },
});

const toForm = (u: User): ProfileForm => ({
  fullName: u.fullName,
  gender: u.gender,
  mobile: u.mobile,
  address: u.address,
  city: u.city,
});

export default function ProfileScreen() {
  const styles = useThemedStyles(factory);
  const { isDark, toggleTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarId, setAvatarId] = useState<string | undefined>(user?.avatarId);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const { values, errors, setValue, touch, handleSubmit, reset } =
    useForm<ProfileForm>(
      { fullName: "", gender: "", mobile: "", address: "", city: "" },
      validateProfile,
    );

  if (!user) return null;

  const startEdit = () => {
    reset(toForm(user));
    setAvatarId(user.avatarId);
    setEditing(true);
  };

  const onSave = handleSubmit(async (form) => {
    setSaving(true);
    try {
      await updateProfile({
        fullName: form.fullName.trim(),
        gender: form.gender as User["gender"],
        mobile: form.mobile.trim(),
        address: form.address.trim(),
        city: form.city,
        avatarId,
      });
      setEditing(false);
    } catch (e) {
      Alert.alert("Could not save", (e as Error).message);
    } finally {
      setSaving(false);
    }
  });

  const onLogout = () => setLogoutVisible(true);

  const confirmLogout = async () => {
    setLogoutVisible(false);
    await logout();
  };

  const rows: [string, string][] = [
    ["Full Name", user.fullName],
    ["Email Address", user.email],
    ["Mobile Number", user.mobile],
    ["Gender", user.gender],
    ["Address", user.address],
    ["City", user.city],
  ];

  if (editing) {
    return (
      <FormLayout>
        <Text style={styles.sectionLabel}>Choose an avatar</Text>
        <View style={styles.avatarGrid}>
          {AVATARS.map((a) => (
            <Pressable
              key={a.id}
              onPress={() => setAvatarId(a.id)}
              style={[
                styles.avatarOption,
                avatarId === a.id && styles.avatarSelected,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: avatarId === a.id }}
              accessibilityLabel={`Avatar ${a.emoji}`}
            >
              <Avatar avatarId={a.id} name={user.fullName} size={52} />
            </Pressable>
          ))}
        </View>

        <Input
          label="Full Name"
          value={values.fullName}
          onChangeText={(t) => setValue("fullName", t)}
          onBlur={() => touch("fullName")}
          error={errors.fullName}
          autoCapitalize="words"
        />
        <Input
          label="Email Address (cannot be changed)"
          value={user.email}
          editable={false}
        />
        <RadioGroup
          label="Gender"
          options={GENDERS}
          value={values.gender}
          onChange={(g) => setValue("gender", g)}
          error={errors.gender}
        />
        <Input
          label="Mobile Number"
          value={values.mobile}
          onChangeText={(t) => setValue("mobile", t.replace(/\s/g, ""))}
          onBlur={() => touch("mobile")}
          error={errors.mobile}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <Input
          label="Address"
          value={values.address}
          onChangeText={(t) => setValue("address", t)}
          onBlur={() => touch("address")}
          error={errors.address}
          multiline
          style={{ height: 80, textAlignVertical: "top", paddingTop: 12 }}
        />
        <Dropdown
          label="City"
          options={CITIES}
          value={values.city}
          onChange={(c) => setValue("city", c)}
          error={errors.city}
        />

        <View style={styles.buttons}>
          <Button title="Save Changes" onPress={onSave} loading={saving} />
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => setEditing(false)}
            disabled={saving}
          />
        </View>
      </FormLayout>
    );
  }

  return (
    <FormLayout>
      <View style={styles.header}>
        <Avatar avatarId={user.avatarId} name={user.fullName} />
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.card}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
        <View style={styles.themeRow}>
          <Text style={styles.themeLabel}>Dark mode</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>

      <View style={styles.buttons}>
        <Button title="Edit Profile" onPress={startEdit} />
        <Button title="Log Out" variant="danger" onPress={onLogout} />
      </View>

      <DownloadFeedbackModal
        visible={logoutVisible}
        type="error"
        title="Log Out?"
        message="Are you sure you want to log out?"
        onClose={() => setLogoutVisible(false)}
        onRetry={confirmLogout}
      />
    </FormLayout>
  );
}
