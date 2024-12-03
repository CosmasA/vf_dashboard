import React from "react";
import User from "../../assets/user.png";

const Team = () => {
  const team = [
    {
      id: 1,
      name: "Musiime Martin",
      post: "Lead Project Manager",
      department: "Fundi @School",
      Image: User,
    },
    {
      id: 2,
      name: "Solomon King Benge",
      post: "Product Owner",
      department: "Applied Sciences",
      Image: User,
    },
    {
      id: 3,
      name: "Apuke Cosmas",
      post: "Front-End Developer",
      department: "Applied Sciences",
      Image: User,
    },
    {
      id: 4,
      name: "Okello George",
      post: "Back-End Developer",
      department: "Applied Sciences",
      Image: User,
    },
    {
      id: 5,
      name: "Ojok Rogers",
      post: "Mobile App Developer",
      department: "Applied Sciences",
      Image: User,
    },
    {
      id: 6,
      name: "Tayebwa Barnabas",
      post: "Project Manager",
      department: "Fundi @School",
      Image: User,
    },
    {
      id: 7,
      name: "Obote Geoffrey Tale",
      post: "Project Manager",
      department: "Fundi @School",
      Image: User,
    },
    {
      id: 8,
      name: "Lumbuye Nicholas Kasaasa",
      post: "Project Manager",
      department: "Fundi @School",
      Image: User,
    },
    {
      id: 9,
      name: "Kituyi Juliet Irene",
      post: "Project's Finance",
      department: "Fundi @Home",
      Image: User,
    },
    {
      id: 10,
      name: "Okecho Michael",
      post: "Media Team Lead",
      department: "Fundi @Home",
      Image: User,
    },
    {
      id: 11,
      name: "Namugwere Florence",
      post: "M&E Personnel",
      department: "Fundi @School",
      Image: User,
    },
  ];

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header no-border">
          <h4 style={{ color: "#526d82", margin: 0 }}>VirtualFundi Team</h4>
        </div>
        <div className="card-body">
          <div className="team-list">
            <div className="list-container">
              <div className="list-header">
                <div className="list-item id">ID</div>
                <div className="list-item avatar">Photo</div>
                <div className="list-item">Name</div>
                <div className="list-item">Post</div>
                <div className="list-item">Department</div>
              </div>
              {team.map((member) => (
                <div className="list-row" key={member.id}>
                  <div className="list-item id">{member.id}</div>
                  <div className="list-item avatar">
                    <img src={member.Image} alt="User" className="user-image" />
                  </div>
                  <div className="list-item">{member.name}</div>
                  <div className="list-item">{member.post}</div>
                  <div className="list-item">{member.department}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
