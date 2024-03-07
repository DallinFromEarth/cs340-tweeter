import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { Presenter } from "./Presenter";
import { AuthPresenter, AuthView } from "./AuthPresenter";
import { User, AuthToken } from "tweeter-shared";

export interface RegisterView extends AuthView {
    setImageUrl: (value: React.SetStateAction<string>) => void;
    setImageBytes: (value: React.SetStateAction<Uint8Array>) => void;
}

export class RegisterPresenter extends AuthPresenter{

    public constructor(view: RegisterView) {
      super(view)
    }

    protected get view(): RegisterView {
      return super.view as RegisterView;
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        rememberMe: boolean
        ) {
          this.doAuthentication(
            rememberMe, 
            "register user", 
            async () => await this.service.register(
              firstName,
              lastName,
              alias,
              password,
              imageBytes
            ),
            () => this.view.navigate("/"))
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