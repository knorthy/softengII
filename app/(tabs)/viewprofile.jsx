import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { hp, wp } from '../../helpers/common';

const ViewProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); 

  const [user, setUser] = useState({
    name: 'John Doe',
    username: 'johndoe92',
    email: 'john.doe@example.com',
    password: 'secret123',         
    accountCreated: 'March 15, 2023',
    signupMethod: 'Google',
    avatar: null,
  });

  const [editedUser, setEditedUser] = useState({
    ...user,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
  if (editedUser.newPassword && editedUser.newPassword !== editedUser.confirmPassword) {
    Alert.alert('Error', 'New passwords do not match');
    return;
  }
  if (editedUser.newPassword && editedUser.newPassword.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
  }

  setUser({
    ...user,
    name: editedUser.name,
    avatar: editedUser.avatar,
  });

  
  setShowChangePassword(false); 
  setIsEditing(false);

  Alert.alert('Success', 'Profile updated successfully!');
};

  const handleCancel = () => {
  setEditedUser({
    ...user,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Hide password visibility toggles
  setShowCurrent(false);
  setShowNew(false);
  setShowConfirm(false);

  // Close the Change Password section
  setShowChangePassword(false);

  // Exit edit mode completely
  setIsEditing(false);
};

  const pickImage = () => {
    Alert.alert('Image Picker', 'Gallery/camera will open in real app');
    setEditedUser({
      ...editedUser,
      avatar: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        {isEditing && (
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Icon name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
        )}
        {!isEditing && <View style={styles.backButton} />}

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            My Profile
          </Text>
        </View>

        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.rightButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.rightButton} />
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={isEditing ? pickImage : null} disabled={!isEditing}>
            {editedUser.avatar ? (
              <Image source={editedUser.avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={60} color="#888" />
                {isEditing && (
                  <View style={styles.cameraIconOverlay}>
                    <Icon name="camera" size={28} color="#fff" />
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>

          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={editedUser.name}
              onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
              placeholder="Your name"
              placeholderTextColor="#aaa"
              autoFocus
            />
          ) : (
            <Text style={styles.name}>{user.name}</Text>
          )}
        </View>

        {/* Profile Info Card */}
       <View style={styles.infoCard}>
          {/* Username */}
          <View style={styles.infoRow}>
            <Icon name="at" size={22} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>@{user.username}</Text>
              <Text style={styles.label}>Username</Text>
            </View>
          </View>

         {/* PASSWORD ROW */}
      <View style={styles.infoRow}>
        <Icon name="lock-closed-outline" size={22} color="#007AFF" />
        <View style={styles.infoContent}>
          <View style={styles.passwordDisplayContainer}>
            <View>
              <Text style={styles.infoText}>••••••••</Text>
              <Text style={styles.label}>Password</Text>
            </View>

      {/* Edit */}
      {isEditing && (
        <TouchableOpacity
          onPress={() => setShowChangePassword(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.editPasswordText}>Edit</Text>
        </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

          {/* Email */}
          <View style={styles.infoRow}>
            <Icon name="mail-outline" size={22} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>{user.email}</Text>
              <Text style={styles.label}>Email</Text>
            </View>
          </View>

          {/* Account Created */}
          <View style={styles.infoRow}>
            <Icon name="calendar-outline" size={22} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>{user.accountCreated}</Text>
              <Text style={styles.label}>Member since</Text>
            </View>
          </View>

        {/* Sign-up Method */}
          <View style={styles.infoRow}>
            <Icon
              name={user.signupMethod === 'Google' ? 'logo-google' : 
                    user.signupMethod === 'Apple'  ? 'logo-apple'  : 
                    'mail-outline'}
              size={22}
              color="#007AFF"
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>
                Signed up with 
              </Text>
              {}
              <Text style={styles.label}>{user.signupMethod} account</Text>
            </View>
          </View>

      {/* CHANGE PASSWORD SECTION */}
      {isEditing && showChangePassword && (
      <>
    <View style={styles.divider} />

    {/* Header */}
    <View style={styles.changePasswordHeader}>
      <Text style={styles.sectionTitle}>Change Password</Text>
    </View>

    {/* Current Password */}
    <View style={styles.passwordRow}>
      <Icon name="lock-closed-outline" size={22} color="#007AFF" />
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Current password"
          value={editedUser.currentPassword}
          onChangeText={(text) => setEditedUser({ ...editedUser, currentPassword: text })}
          secureTextEntry={!showCurrent}
        />
        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
          <Icon name={showCurrent ? 'eye-off-outline' : 'eye-outline'} size={22} color="#666" />
        </TouchableOpacity>
      </View>
    </View>

    {/* New Password */}
    <View style={styles.passwordRow}>
      <Icon name="key-outline" size={22} color="#007AFF" />
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="New password"
          value={editedUser.newPassword}
          onChangeText={(text) => setEditedUser({ ...editedUser, newPassword: text })}
          secureTextEntry={!showNew}
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Icon name={showNew ? 'eye-off-outline' : 'eye-outline'} size={22} color="#666" />
        </TouchableOpacity>
      </View>
    </View>

    {/* Confirm Password */}
    <View style={styles.passwordRow}>
      <Icon name="checkmark-circle-outline" size={22} color="#007AFF" />
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm new password"
          value={editedUser.confirmPassword}
          onChangeText={(text) => setEditedUser({ ...editedUser, confirmPassword: text })}
          secureTextEntry={!showConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Icon name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={22} color="#666" />
        </TouchableOpacity>
          </View>
        </View>
      </>
    )}
  </View>

        {/* Save/Cancel buttons */}
        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9f9f9' 
  },

  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(2),
    backgroundColor: '#f9f9f9',
    zIndex: 10,
  },

  backButton: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  headerTitleContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: wp(10) 
  },

  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000' 
  },

  rightButton: { 
    width: 50, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  editButtonText: { 
    fontSize: 17, 
    color: '#007AFF', 
    fontWeight: '600' 
  },

  scrollContent: { 
    paddingBottom: hp(5) 
  },

  avatarSection: { 
    alignItems: 'center', 
    marginBottom: hp(4), 
    paddingTop: hp(3) 
  },

  avatar: { 
    width: wp(38), 
    height: wp(38), 
    borderRadius: wp(19) 
  },

  avatarPlaceholder: {
    width: wp(38),
    height: wp(38),
    borderRadius: wp(19),
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(19),
  },

  name: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: hp(2.5) 
  },

  nameInput: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 14,
    marginTop: hp(2),
    width: '85%',
  },

  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: wp(5),
    borderRadius: 16,
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: hp(2) 
  },

  infoContent: { 
    flex: 1, 
    marginLeft: wp(4) 
  },

  infoText: { 
    fontSize: 17 
  },

  label: { 
    fontSize: 13, 
    color: '#888', 
    marginTop: 4 
  },

  passwordDisplayContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: wp(4),
  },

  divider: { 
    height: 1, 
    backgroundColor: '#eee', 
    marginVertical: hp(3) 
  },

  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: hp(2) 
  },

  passwordRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: hp(1.8) 
  },

  passwordInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginLeft: wp(4),
  },

  passwordInput: { 
    flex: 1, 
    fontSize: 17, 
    paddingHorizontal: 14, 
    paddingVertical: 12 
  },

  eyeIcon: { 
    paddingHorizontal: 12 
  },

  buttonContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: wp(5), 
    paddingVertical: hp(3), 
    paddingBottom: hp(5), 
    gap: wp(3) 
  },

  actionButton: { 
    flex: 1, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },

  saveButton: { 
    backgroundColor: '#007AFF' 
  },

  cancelButton: { 
    backgroundColor: '#eee' 
  },

  saveText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: '600' 
  },

  cancelText: { 
    color: '#333', 
    fontSize: 17, 
    fontWeight: '600' 
  },

  passwordDisplayContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
  },

  editPasswordText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },

  changePasswordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ViewProfileScreen;