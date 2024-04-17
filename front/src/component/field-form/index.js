import { useState } from "react";
import "./index.css";

export default function Component({ placeholder, button, onSubmit}) {
    const [value, setValue] = useState("");
    const hendleChange = (e) => setValue(e.target.value);

    const hendleSubmit = () => {
        if(value.length === 0) return null;

        if(onSubmit) {
            onSubmit(value);
        } else {
            throw new Error("onSubmit props is undefined")
        }

        setValue("")
    }

    const isDisabled = value.length === 0;

    return (
        <div className="field-flex">
            <textarea 
               onChange={hendleChange}
               value={value}
               rows={2}
               placeholder={placeholder}
               className="field-button"
            ></textarea>
            <button
               disabled={isDisabled}
               onClick={hendleSubmit}
               className="field-form"
            >
                {button}
            </button>
        </div>
    )
}