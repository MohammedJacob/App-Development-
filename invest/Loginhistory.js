import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { View, Text } from "react-native";  // Use View and Text from React Native

const LoginHistory = ({ userId }) => {
    const [history, setHistory] = useState([]);
    const [currentSession, setCurrentSession] = useState({
        loginTime: null,
        currentTime: moment().format("DD/MM/YYYY HH:mm:ss"),
    });
    const [loginId, setLoginId] = useState(null); // Store the ID of the current login session

    // Fetch Login History
    useEffect(() => {
        axios
            .get(`http://localhost:3000/LoginHistory/${userId}`)
            .then((response) => {
                setHistory(response.data.history);
            })
            .catch((error) => {
                console.error("Error fetching login history:", error);
            });
    }, [userId]);

    // Start Current Session
    useEffect(() => {
        axios
            .post("http://localhost:3000/LoginHistory", { user_id: userId })
            .then((response) => {
                setLoginId(response.data.login_id); // Save the current session ID
                setCurrentSession((prev) => ({
                    ...prev,
                    loginTime: moment().format("DD/MM/YYYY HH:mm:ss"),
                }));
            })
            .catch((error) => {
                console.error("Error starting session:", error);
            });

        // Update the current time every second
        const interval = setInterval(() => {
            setCurrentSession((prev) => ({
                ...prev,
                currentTime: moment().format("DD/MM/YYYY HH:mm:ss"),
            }));
        }, 1000);

        // Logout on component unmount
        return () => {
            clearInterval(interval);
            if (loginId) {
                axios
                    .put("http://localhost:3000/LoginHistory/Logout", {
                        login_id: loginId,
                    })
                    .then(() => {
                        console.log("Logout recorded");
                    })
                    .catch((error) => {
                        console.error("Error recording logout:", error);
                    });
            }
        };
    }, [userId, loginId]);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Login History</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 15 }}>
                {history.map((record) => (
                    <View
                        key={record.id}
                        style={{
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 10,
                            width: 200,
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Date: </Text>
                            {moment(record.login_time).format("DD/MM/YYYY")}
                        </Text>
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Time Spent: </Text>
                            {record.time_spent
                                ? `${Math.floor(record.time_spent / 60)} mins ${
                                      record.time_spent % 60
                                  } secs`
                                : "No data"}
                        </Text>
                    </View>
                ))}
            </View>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Current Session</Text>
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 15,
                    width: 300,
                    backgroundColor: "#e6f7ff",
                }}
            >
                <Text>
                    <Text style={{ fontWeight: "bold" }}>Login Time: </Text>
                    {currentSession.loginTime || "Loading..."}
                </Text>
                <Text>
                    <Text style={{ fontWeight: "bold" }}>Current Time: </Text>
                    {currentSession.currentTime}
                </Text>
            </View>
        </View>
    );
};

export default LoginHistory;
