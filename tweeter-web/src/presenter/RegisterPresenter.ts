import { NavigateOptions, To } from "react-router-dom";
import { UserService } from "../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { Presenter, View } from "./Presenter";

export interface RegisterView extends View{
    navigate: (to: To, options?: NavigateOptions | undefined) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
    setImageUrl: (value: React.SetStateAction<string>) => void;
    setImageBytes: (value: React.SetStateAction<Uint8Array>) => void;
}

export class RegisterPresenter extends Presenter{
    private service: UserService;

    public constructor(view: RegisterView) {
      super(view)
      this.service = new UserService();
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        rememberMe: boolean
        ) {
        try {
            let [user, authToken] = await this.service.register(
              firstName,
              lastName,
              alias,
              password,
              imageBytes
            );
      
            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate("/");
          } catch (error) {
            this.view.displayErrorMessage(
              `Failed to register user because of exception: ${error}`
            );
          }
    }

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));
      
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
              const imageStringBase64 = event.target?.result as string;
      
              // Remove unnecessary file metadata from the start of the string.
              const imageStringBase64BufferContents =
                imageStringBase64.split("base64,")[1];
      
              const bytes: Uint8Array = Buffer.from(
                imageStringBase64BufferContents,
                "base64"
              );
      
              this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);
          } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
          }
    }
}