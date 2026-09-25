import { IRootState } from "@/app/store";
import DefaultProfile from "@/assets/images/default.png";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SquarePen } from "lucide-react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import ImageCropDialog from "../components/ImageCropDialog";
import { profileSchema } from "../schema/settings.schema";
import { ProfileSettingsFormValues } from "../types/settings.types";
import { useUpdateSettingsMutation } from "../api/settingsApi";
import { toast } from "sonner";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import { setUserInfo } from "@/shared/slices/userSlice";
import { cn } from "@/lib/utils";

const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>((props, ref) => <Input {...props} ref={ref} />);
PhoneNumberInput.displayName = "PhoneNumberInput";

const SettingsRow = ({
  title,
  description,
  children,
  stack = true,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  stack?: boolean;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
    <div>
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
    <div
      className={cn(
        "col-span-1 sm:col-span-3 flex gap-4",
        stack ? "flex-col sm:flex-row" : "flex-row items-center",
      )}
    >
      {children}
    </div>
  </div>
);

const AccountSettings = () => {
  const user = useSelector((state: IRootState) => state.userDetails);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Raw file the user just picked, held only long enough to crop it —
  // the form's profile_image is set from the cropped result, not this.
  const [rawImage, setRawImage] = useState<{ src: string; file: File } | null>(
    null,
  );
  const [cropDialogOpen, setCropDialogOpen] = useState(false);


  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
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

  useEffect(() => {
    return () => {
      if (rawImage) {
        URL.revokeObjectURL(rawImage.src);
      }
    };
  }, [rawImage]);

  const onSubmit = async (values: ProfileSettingsFormValues) => {
    try {
      const updated = await updateSettings({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        profile_image: values.profile_image,
      }).unwrap();
      dispatch(
        setUserInfo({
          id: user?.id ?? null,
          firstName: updated.firstName,
          lastName: updated.lastName,
          username: user?.username ?? "",
          email: updated.email,
          role: user?.role ?? "",
          phoneNumber: updated.phoneNumber,
          profileImage: updated.profileImageUrl,
        }),
      );
      toast.success("Account updated");
    } catch (err) {
      const errorMessage = handleCatchErrorMessage(err);
      toast.error(errorMessage);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <SettingsRow title="Profile picture" stack={false}>
        <div className="relative h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <img
            src={avatarPreview}
            alt={user?.firstName ?? "Profile picture"}
            className="h-14 w-14 rounded-full object-cover"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              // reset so re-selecting the same file still fires onChange
              e.target.value = "";
              if (!file) return;

              setRawImage((prev) => {
                if (prev) URL.revokeObjectURL(prev.src);
                return { src: URL.createObjectURL(file), file };
              });
              setCropDialogOpen(true);
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
                inputComponent={PhoneNumberInput}
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
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={!isValid || !isDirty || isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <ImageCropDialog
        open={cropDialogOpen}
        setOpen={setCropDialogOpen}
        imageSrc={rawImage?.src ?? null}
        fileName={rawImage?.file.name ?? "profile.jpg"}
        onCropped={(file) => {
          setValue("profile_image", file, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </form>
  );
};

export default AccountSettings;