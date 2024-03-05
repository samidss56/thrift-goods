import MemberLayout from "@/components/layouts/MemberLayout";
import styles from "./Profile.module.scss";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { uploadFile } from "@/lib/firebase/service";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import userServices from "@/services/user";
import { User } from "@/types/user.type";

type PropTypes = {
  profile: User | any;
  setProfile: Dispatch<SetStateAction<{}>>;
  session: any;
  setToaster: Dispatch<SetStateAction<{}>>;
};

const ProfileMemberView = ({
  profile,
  setProfile,
  session,
  setToaster,
}: PropTypes) => {
  const [changeImage, setChangeImage] = useState<File | any>({});
  const [isLoading, setIsLoading] = useState("");

  const handleChangeProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("profile");
    const form = e.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      phone: form.phone.value,
    };
    const result = await userServices.updateProfile(
      data,
      session.data?.accessToken
    );

    if (result.status === 200) {
      setIsLoading("");
      setProfile({
        ...profile,
        fullname: data.fullname,
        phone: data.phone,
      });
      form.reset();
      setToaster({
        variant: "success",
        message: "Success Update Profile",
      });
    } else {
      setIsLoading("");
      setToaster({
        variant: "danger",
        message: "Failed Update Profile",
      });
    }
  };

  const handleChangeProfilePicture = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("picture");
    const form = e.target as HTMLFormElement;
    const file = form.image.files[0];
    const newName = "profile." + file.name.split(".")[1];
    if (file) {
      uploadFile(
        profile.id,
        file,
        newName,
        "users",
        async (status: boolean, newImageURL: string) => {
          if (status) {
            const data = {
              image: newImageURL,
            };
            const result = await userServices.updateProfile(
              data,
              session.data?.accessToken
            );

            if (result.status === 200) {
              setIsLoading("");
              setProfile({
                ...profile,
                image: newImageURL,
              });
              setChangeImage({});
              form.reset();
              setToaster({
                variant: "success",
                message: "Success Change Avatar",
              });
            } else {
              setIsLoading("");
            }
          } else {
            setIsLoading("");
            setChangeImage({});
            setToaster({
              variant: "danger",
              message: "Failed Change Avatar",
            });
          }
        }
      );
    }
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("password");
    const form = e.target as HTMLFormElement;
    const data = {
      password: form["new-password"].value,
      oldPassword: form["old-password"].value,
      encryptedPassword: profile.password,
    };
    try {
      const result = await userServices.updateProfile(
        data,
        session.data?.accessToken
      );

      if (result.status === 200) {
        setIsLoading("");
        form.reset();
        setToaster({
          variant: "success",
          message: "Success Change Password",
        });
      }
    } catch (error) {
      setIsLoading("");
      setToaster({
        variant: "danger",
        message: "Failed Change Password",
      });
    }
  };

  return (
    <MemberLayout>
      <h1 className={styles.profile__title}>Profile</h1>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__row}>
          <div className={styles.profile__main__row__avatar}>
            <h2 className={styles.profile__main__row__avatar__title}>Avatar</h2>
            {profile.image ? (
              <Image
                className={styles.profile__main__row__avatar__image}
                src={profile.image}
                alt="User Profile"
                width={200}
                height={200}
              />
            ) : (
              <div className={styles.profile__main__row__avatar__image}>
                {profile?.fullname?.charAt(0)}
              </div>
            )}
            <form onSubmit={handleChangeProfilePicture}>
              <label
                className={styles.profile__main__row__avatar__label}
                htmlFor="upload-image"
              >
                {changeImage.name ? (
                  <p>{changeImage.name}</p>
                ) : (
                  <>
                    <p>Upload a new Avatar</p>
                    <p>
                      Maximum upload size is <b>1 MB</b>
                    </p>
                  </>
                )}
              </label>
              <input
                className={styles.profile__main__row__avatar__input}
                type="file"
                name="image"
                id="upload-image"
                onChange={(e: any) => {
                  e.preventDefault();
                  setChangeImage(e.currentTarget.files[0]);
                }}
              />
              <Button
                className={styles.profile__main__row__avatar__button}
                type="submit"
                variant="primary"
              >
                {isLoading === "picture" ? "Uploading..." : "Upload Picture"}
              </Button>
            </form>
          </div>
          <div className={styles.profile__main__row__profile}>
            <h2>Profile</h2>
            <form onSubmit={handleChangeProfile}>
              <Input
                label="Fullname"
                type="text"
                name="fullname"
                defaultValue={profile.fullname}
              />
              <Input
                label="Phone"
                type="number"
                name="phone"
                defaultValue={profile.phone}
                placeholder="Input your phone number"
              />
              <Input
                label="Email"
                type="text"
                name="email"
                defaultValue={profile.email}
                disabled
              />
              <Input
                label="Role"
                type="text"
                name="role"
                defaultValue={profile.role}
                disabled
              />
              <Button
                className={styles.profile__main__row__profile__buttton}
                type="submit"
                variant="primary"
              >
                {isLoading === "profile" ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>
          <div className={styles.profile__main__row__password}>
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <Input
                label="Old Password"
                type="password"
                name="old-password"
                disabled={profile.type === "google"}
                placeholder="Enter your old password"
              />
              <Input
                label="New Password"
                type="password"
                name="new-password"
                disabled={profile.type === "google"}
                placeholder="Enter your new password"
              />
              <Button
                disabled={isLoading === "password" || profile.type === "google"}
                type="submit"
              >
                {isLoading === "password" ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ProfileMemberView;
