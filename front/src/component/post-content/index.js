import "./index.css";

import Grid from "../grid";

export default function Component({ username, date, text}) {
    return (
        <Grid>
            <div className="post-content">
                <span className="username">@{username}</span>
                <span className="date">{date}</span>
            </div>
            <p className="post-text">{text}</p>
        </Grid>
    )
}