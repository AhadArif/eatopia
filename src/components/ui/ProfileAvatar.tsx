import { Avatar, For, HStack } from "@chakra-ui/react"

interface ProfileAvatarProps {
  name?: string;
  variant?: "solid" | "outline" | "subtle";
}

export const ProfileAvatar = ({ name = "User", variant = "solid" }: ProfileAvatarProps) => {
  return (
    <Avatar.Root variant={variant} size="sm">
      <Avatar.Fallback name={name} />
    </Avatar.Root>
  );
};

// Demo component as you provided
export const AvatarDemo = () => {
  return (
    <HStack gap="3">
      <For each={["solid", "outline", "subtle"]}>
        {(variant) => (
          <Avatar.Root key={variant} variant={variant}>
            <Avatar.Fallback name="Segun Adebayo" />
          </Avatar.Root>
        )}
      </For>
    </HStack>
  );
};
