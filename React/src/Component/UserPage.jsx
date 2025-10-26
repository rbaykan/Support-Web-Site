import React, { useState, useEffect } from "react";
import {
  closeTicket,
  createTicketWithJWt,
  getTickets,
  loginWithJwt,
  sendMessage,
} from "../Service/UserService";
import { Form, Select, Input, Button, Card, Space, message } from "antd";

const jwtToken = localStorage.getItem("userToken");

const { TextArea } = Input;

const categoires = [
  { value: "GENERAL", label: "GENERAL" },
  { value: "HELP", label: "HELP" },
  { value: "Technical_Support", label: "Technical_Support" },
  { value: "LOGIN_ISSUE", label: "LOGIN_ISSUE" },
  { value: "FEEDBACK", label: "FEEDBACK" },
];

const categoriesFilter = [
  { value: "ALL", label: "ALL CATEGORY" },
  { value: "GENERAL", label: "GENERAL" },
  { value: "HELP", label: "HELP" },
  { value: "Technical_Support", label: "Technical_Support" },
  { value: "LOGIN_ISSUE", label: "LOGIN_ISSUE" },
  { value: "FEEDBACK", label: "FEEDBACK" },
];

const ticketStatusFilter = [
  { value: "ALL", label: "ALL STATUS" },
  { value: "OPEN", label: "OPEN" },
  { value: "REPLIED", label: "REPLIED" },
  { value: "CLOSED", label: "CLOSED" },
];

const colorDictionary = {
  GENERAL: "#FFF176",          
  HELP: "#64B5F6",              
  Technical_Support: "#B0BEC5", 
  LOGIN_ISSUE: "#EF5350",      
  FEEDBACK: "#BA68C8",        
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const UserPage = ({ selected, user }) => {
  const [tickets, setTickets] = useState([]);

  const [profile, setProfile] = useState(true);
  const [myTickets, setMyTickets] = useState(false);
  const [createTicket, setCreateTicket] = useState(false);
  const [showAllTickets, setshowAllTickets] = useState(false);

  useEffect(() => {
    if (selected === "1") {
      handProfile();
    }

    if (selected === "2") {
      handleMyTickets();
    }

    if (selected === "3") {
      handCreateTicket();
    }
    if (selected === "4") {
      handShowAllTickets();
    }
    if (selected === "5") {
      handleLogOut();
    }

    console.log(myTickets);
  }, [selected]);

  const handProfile = () => {
    allStateFalse();

    setProfile(true);
  };

  const handleMyTickets = () => {
    allStateFalse();
    setMyTickets(true);
    setshowAllTickets(true);
  };

  const handCreateTicket = () => {
    allStateFalse();

    setCreateTicket(true);
  };

  const handShowAllTickets = () => {
    allStateFalse();
    setshowAllTickets(true);
    getTicketsFunc();
  };

  const allStateFalse = () => {
    setMyTickets(false);
    setCreateTicket(false);
    setProfile(false);
    setshowAllTickets(false);
  };

  const handleLogOut = () => {
    handProfile();
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  const getTicketsFunc = () => {
    getTickets(jwtToken)
      .then((response) => {
        setTickets(response.data);
      })
      .catch((_error) => {});
  };

  useEffect(() => {
    console.log(tickets);
  }, [tickets]);

  return (
    <>
      {!profile ? (
        <div>
         
        </div>
      ) : (
        <div> </div>
      )}
      {user ? (
        <div>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card
              title={
                profile
                  ? `Welcome, ${user.firstname} ${user.lastname}`
                  : myTickets
                  ? "My Tickets"
                  : createTicket
                  ? "Create Ticket"
                  : user.roles.some((role) => role.role === "ROLE_ADMIN")
                  ? "Manage Users' Tickets"
                  : "My Tickets"
              }
              style={{
                height: profile ? 200 : 900,
                overflow: "auto",
              }}
            >
              {profile ? (
                <>
                  <p>
                    username: <b>{user.username}</b>
                  </p>
                  
                </>
              ) : createTicket ? (
                CreateTicket()
              ) : showAllTickets ? (
                <ManageTicket
                  tickets={
                    myTickets
                      ? user.tickets
                      : user.roles.some((role) => role.role === "ROLE_ADMIN")
                      ? tickets
                      : user.tickets
                  }
                  user={user}
                />
              ) : (
                <div />
              )}
            </Card>
          </Space>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

const ManageTicket = ({ tickets, user }) => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const filteredTickets = tickets?.filter((ticket) => {
    const categoryMatch =
      selectedCategory === "ALL" || ticket.ticketCategory === selectedCategory;
    const statusMatch =
      selectedStatus === "ALL" || ticket.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const [readTicket, setReadTicket] = useState(false);
  const [ticketItem, setTicket] = useState(null);

  const handReadTicket = (value) => {
    setReadTicket(true);
    setTicket(value);
  };

  return (
    <>
      {!readTicket ? (
        <div>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Form.Item label="Category">
              <Select
                placeholder="Select a category"
                value={selectedCategory}
                options={categoriesFilter}
                onChange={handleCategoryChange}
              />
            </Form.Item>

            <Form.Item label="Status">
              <Select
                placeholder="Select a status"
                value={selectedStatus}
                options={ticketStatusFilter}
                onChange={handleStatusChange}
              />
            </Form.Item>
          </Form>

          {filteredTickets?.length > 0 ? (
            filteredTickets.map((ticket) => (
              <Card
                hoverable
                title={"Thread: " + ticket.thread}
                style={{
                  width: 550,
                  marginBottom: 20,
                  border: "2px solid #1890ff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => handReadTicket(ticket)}
              >
                <p
                  style={{
                    backgroundColor:
                      ticket.status === "REPLIED"
                        ? "lightgreen"
                        : ticket.status === "CLOSED"
                        ? "lightcoral"
                        : "transparent",
                    border: "1px solid #ccc",
                    display: "inline-block",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {ticket.status}
                </p>
                <p
                  style={{
                    backgroundColor: colorDictionary[ticket.ticketCategory],
                    color: "#004080",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    display: "inline-block",
                    border: "1px solid #b3d7ff",
                    fontWeight: "500",
                    marginBottom: "6px",
                  }}
                >
                  {ticket.ticketCategory}
                </p>

                <p
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px 14px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    fontStyle: "italic",
                    color: "#333",
                    lineHeight: "1.5",
                    maxWidth: "90%",

                    marginBottom: "8px",
                  }}
                >
                  {ticket?.messages[0].message}
                </p>
                <p>{ticket.user ? "user: " + ticket.user.username : ""}</p>
              </Card>
            ))
          ) : (
            <p>No tickets match the selected filters.</p>
          )}
        </div>
      ) : (
         <ReadTicket ticket={ticketItem} uId={user.id} uname={user.username} role = {user.roles.some((role) => role.role === "ROLE_ADMIN") ? "ADMIN" : "USER"}/>
      )}
    </>
  );
};

const ReadTicket = ({ ticket, uId, uname, role }) => {

  const [form] = Form.useForm();
  const [messages, setMessages] = useState(ticket.messages);
  

  const handleSendMessage = (values) => {

    const msg = {
      userId: uId,
      ticketId: ticket.id,
      mes: values.message,
    };

    console.log(msg);

    sendMessage(jwtToken, msg)
      .then((response) => {
        setMessages(prevs => [...prevs, response.data]);
        form.resetFields()
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const handCloseTicket = () => {

      const ClosedTicket = {
        id: ticket.id
      }

      closeTicket(jwtToken, ClosedTicket)
      .then((response) => {
        form.resetFields()
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });

  };

  return (
    <>
      <div>
        <p>Thread: {ticket.thread}</p>
        <p>Category: {ticket.ticketCategory}</p>
        <p>Messages: </p>
        {messages?.map((message) => (
          <p
            style={{
              backgroundColor: message.user === uname ? "purple" : "lightgray",
              color: message.user === uname ? "white" : "black",
              padding: "6px 10px",
              borderRadius: "6px",
              marginBottom: "6px",
              border: "1px solid #ccc",
              display: "block",
              width: "fit-content",
              wordBreak: "break-word",
            }}
          >
            {message.user === uname ? "you: " : `${message.user}: `}
            {message.message}
          </p>
        ))}

        {ticket.status !== 'CLOSED' ? (<div><Form form={form} onFinish={handleSendMessage}>
          <Form.Item
            label="Message"
            name="message"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>

        {role === "ADMIN" ? <Button type="primary" htmlType="submit" onClick={handCloseTicket}>
          Close Ticket
        </Button> : <div></div>}

         </div>): <div></div>}

        
      </div>
    </>
  );
};

const CreateTicket = () => {
  const onFinish = (values) => {
    createTicketWithJWt(values, jwtToken)
      .then((_response) => {
        window.location.reload();
      })
      .catch((_error) => {
        console.log("error");
      });
  };

  return (
    <>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item
          label="Category"
          name="ticketCategory"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Select
            placeholder="Select a category"
            optionFilterProp="label"
            options={categoires}
          />
        </Form.Item>

        <Form.Item
          label="Thread"
          name="thread"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="Message"
          name="message"
          rules={[
            { required: true, message: "Please input your description!" },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        
      </Form>
    
    </>
  );
};

export default UserPage;
