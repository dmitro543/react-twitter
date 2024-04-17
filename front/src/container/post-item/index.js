import PostContent from "../../component/post-content"
import { Fragment, useState } from "react";
import Box from "../../component/box";
import Grid from "../../component/grid";
import PostCreate from "../post-create"
import { Alert, LOAD_STATUS, Skeleton } from "../../component/load";
import { getDate } from "../../util/getDate";

export default function Container({ id, username, text, date }) {
    const [data, setData] = useState({
        id, 
        username, 
        text, 
        date,
        reply: null,
    })

    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");

    const getData = async () => {
        setStatus(LOAD_STATUS.PROGRESS);
        try {
            const res = await fetch(`http://localhost:4000/post-item?id=${data.id}`, {
                method: "GET"
            });

            const resData = await res.json();

            if (res.ok) {
                setData(convertData(resData));
                setStatus(LOAD_STATUS.SUCCESS);
            } else {
                setMessage(resData.message);
                setStatus(LOAD_STATUS.ERROR);
            }
        }
        catch (error) {
            setMessage(error.message);
            setStatus(LOAD_STATUS.ERROR);
        }
    };

    const convertData = ({ post }) => ({
       id: post.id,
       username: post.username,
       text: post.text,
       date: getDate(post.date),

       rerly: post.reply.reverse().map(({ id, username, text, date}) => ({
        id,
        text,
        username,
        date: getDate(date),
     })),

     isEmpty: post.reply.lenght === 0,
    });

    const [isOpen, setOpen] = useState(false);
    const hendleOpen = () => {
        if (status === null) {
            getData();
        }

        setOpen(!isOpen);
    };

    return (
        <Box style={{ padding: "0"}}>
           <div style={{
            padding: "20px",
            cursor: "pointer",
        }} onClick={hendleOpen}>
            <PostContent
              username={data.username}
              date={data.date}
              text={data.text}
            />
        </div>
        {isOpen && (
            <div style={{ padding: "0 20px 20px 20px"}}>
                <Grid>
                    <Box className="post-item--inside-box">
                        <PostCreate
                            placeholder="Post your reply!"
                            button="Reply"
                            id={data.id}
                            onCreate={getData}
                        />
                    </Box>

                    {status === LOAD_STATUS.PROGRESS && (
                        <Fragment>
                            <Box>
                                <Skeleton/>
                            </Box>
                            <Box>
                                <Skeleton/>
                            </Box>
                        </Fragment>
                    )}

                    {status === LOAD_STATUS.ERROR && (
                       <Alert status={status} message={message}/>
                    )}

                    {status === LOAD_STATUS.SUCCESS && 
                      !data.isEmpty === false &&
                      data.reply.map((item) => (
                        <Fragment key={item.id}>
                           <Box>
                              <PostContent {...item}/>
                           </Box>
                        </Fragment>
                      ))}
                </Grid>
            </div>
        )}
        </Box>
    )
}