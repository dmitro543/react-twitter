import { useState, Fragment } from "react";
import Box from "../../component/box";
import Grid from "../../component/grid";
import Title from "../../component/title";
import PostCreate from "../post-create";
import { Alert, Skeleton, LOAD_STATUS } from "../../component/load";
import { getDate } from "../../util/getDate";
import PostItem from "../post-item";
// import { raw } from "express";

export default function Container() {
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [data, sendData] = useState(null);

    const getData = async () => {
        setStatus(LOAD_STATUS.PROGRESS)

       try {
         const res = await fetch("http://localhost:4000/post-list",)

         const data = await res.json();

         if(res.ok) {
            sendData(convertData(data));
            setStatus(LOAD_STATUS.SUCCESS);
         } else {
            setMessage(data.message);
            setStatus(LOAD_STATUS.ERROR);
         }
       } catch (error) {
           setMessage(error.message);
           setStatus(LOAD_STATUS.ERROR);
       };
    };

    const convertData = (raw) => ({
        list: raw.list.reverse().map(({ id, username, text, date }) => ({
            id, 
            username, 
            text, 
            date: getDate(date),
        })),
        isEmpty: raw.list.lenght === 0,
    });

    if (status === null) {
        getData();
    }

    return (
        <Grid>
            <Box>
                <Grid>
                    <Title>
                        Home
                    </Title>
                    <PostCreate
                       onCreate={getData}
                       placeholder="What is happening?!"
                       button="Post"
                    />
                </Grid>
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
            {status === LOAD_STATUS.SUCCESS && (
                <Fragment>
                    {data.isEmpty ?  ((
                        <Alert message="Список постів пустий"/>
                    )) : ((
                        data.list.map((item) => (
                            <Fragment key={item.id}>
                                {/* {item.username} - {item.date} */}
                                <PostItem {...item}/>
                            </Fragment>
                        ))
                    ))
                }
                </Fragment>
            )}
        </Grid>
    )
}