import { useState } from "react";

interface Props {
    onChangeAlias: (value: string) => void;
    onChangePassword: (value: string) => void;
}

const AuthFields = ( props: Props) => {
    
    return (
        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onChange={(event) => props.onChangeAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            placeholder="Password"
            onChange={(event) => props.onChangePassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    )
}

export default AuthFields