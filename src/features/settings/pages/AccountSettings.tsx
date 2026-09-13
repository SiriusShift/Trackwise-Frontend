import { IRootState } from "@/app/store";
import DefaultProfile from "@/assets/images/default.png";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SquarePen } from "lucide-react";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { profileSchema } from "../schema/settings.schema";
import { ProfileSettingsFormValues } from "../types/settings.types";

const SettingsRow = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-4 gap-4">
    <div>
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
    <div className="col-span-3 flex flex-row gap-4">{children}</div>
  </div>
);

const AccountSettings = () => {
  const user = useSelector((state: IRootState) => state.userDetails);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isValid, isDirty, isSubmitting, errors },
  } = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      profile_image: null,
      first_name: user?.firstName ?? "",
      last_name: user?.lastName ?? "",
      email: user?.email ?? "",
      phone_number: user?.phoneNumber ?? "",
    },
  });

  const profileImageFile = watch("profile_image");

  // Only create a blob URL when the file actually changes, and revoke it
  // on cleanup — the previous version leaked a URL on every render.
  const avatarPreview = useMemo(() => {
    if (profileImageFile instanceof File) {
      return URL.createObjectURL(profileImageFile);
    }
    return user?.profileImage ?? DefaultProfile;
  }, [profileImageFile, user?.profileImage]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const onSubmit = (values: ProfileSettingsFormValues) => {
    // TODO: wire up to your update-profile mutation
    console.log(values);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <SettingsRow title="Profile picture">
        <div className="relative h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <img
            src={avatarPreview}
            alt={user?.firstName ?? "Profile picture"}
            className="h-14 w-14 rounded-full object-cover"
          />
          <Controller
            name="profile_image"
            control={control}
            render={({ field: { onChange } }) => (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    onChange(e.target.files?.[0] ?? null);
                    // reset so re-selecting the same file still fires onChange
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Edit profile picture"
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background hover:bg-muted"
                >
                  {user?.profileImage ? (
                    <SquarePen className="h-3 w-3 text-foreground" />
                  ) : (
                    <Plus className="h-3 w-3 text-foreground" />
                  )}
                </button>
              </>
            )}
          />
        </div>
        <div className="content-center">
          <p className="text-sm font-bold">JPG or PNG, at least 200x200px</p>
          {errors.profile_image && (
            <p className="text-destructive text-sm">
              {errors.profile_image.message}
            </p>
          )}
        </div>
      </SettingsRow>

      <Separator />

      <SettingsRow
        title="Full name"
        description="Appears on your profile and invoices."
      >
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            placeholder="Jane"
            aria-invalid={!!errors.first_name}
            aria-describedby={
              errors.first_name ? "first_name-error" : undefined
            }
            {...register("first_name")}
          />
          {errors.first_name && (
            <p id="first_name-error" className="text-destructive text-sm">
              {errors.first_name.message}
            </p>
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            placeholder="Cooper"
            aria-invalid={!!errors.last_name}
            aria-describedby={errors.last_name ? "last_name-error" : undefined}
            {...register("last_name")}
          />
          {errors.last_name && (
            <p id="last_name-error" className="text-destructive text-sm">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </SettingsRow>

      <Separator />

      <SettingsRow
        title="Contact information"
        description="Manage the email and number used to reach you."
      >
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="test@gmail.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-destructive text-sm">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="phone_number">Phone number</Label>
          <Controller
            name="phone_number"
            control={control}
            render={({ field: { value, onChange } }) => (
              <PhoneInput
                id="phone_number"
                placeholder="Enter phone number"
                defaultCountry="PH"
                value={value}
                onChange={onChange}
                aria-invalid={!!errors.phone_number}
                inputComponent={forwardRef<
                  HTMLInputElement,
                  React.ComponentProps<"input">
                >((props, ref) => (
                  <Input {...props} ref={ref} />
                ))}
              />
            )}
          />
          {errors.phone_number && (
            <p className="text-destructive text-sm">
              {errors.phone_number.message}
            </p>
          )}
        </div>
      </SettingsRow>

      <Separator />

      <div className="flex justify-end">
        <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

export default AccountSettings;
