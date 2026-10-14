import { memo } from 'react';
import { Text, View } from 'react-native';
import { AVATARS } from '../constants';

interface Props {
  avatarId?: string;
  name: string;
  size?: number;
}

function AvatarComponent({ avatarId, name, size = 88 }: Props) {
  const avatar = AVATARS.find((a) => a.id === avatarId);
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: avatar?.color ?? '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      accessibilityLabel="Profile avatar"
    >
      <Text style={{ fontSize: size * 0.5, color: '#fff', fontWeight: '700' }}>
        {avatar ? avatar.emoji : initial}
      </Text>
    </View>
  );
}

export const Avatar = memo(AvatarComponent);
