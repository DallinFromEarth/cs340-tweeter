import { useState } from "react";

interface Props {
    onChangeAlias: (value: string) => void;
    onChangePassword: (value: string) => void;
    isBottomField: boolean;
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
            aria-label="alias"
            placeholder="name@example.com"
            onChange={(event) => props.onChangeAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className={`form-floating ${props.isBottomField ? "mb-3" : ""}`}>
          <input
            type="password"
            className={`form-control ${props.isBottomField ? "bottom" : ""}`}
            id="passwordInput"
            aria-label="password"
            placeholder="Password"
            onChange={(event) => props.onChangePassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    )
}

export default AuthFields