const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dynamoDb = require("../config/dynamo");

const TABLE = process.env.ADMIN_TABLE;

exports.registerAdmin = async ({ email, password }) => {
  const existing = await dynamoDb.scan({
    TableName: TABLE,
    FilterExpression: "email = :e",
    ExpressionAttributeValues: { ":e": email }
  }).promise();

  if (existing.Items && existing.Items.length > 0) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = {
    adminID: `ADMIN#${Date.now()}`,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  await dynamoDb.put({
    TableName: TABLE,
    Item: admin
  }).promise();

  return { adminID: admin.adminID };
};

exports.loginAdmin = async ({ email, password }) => {
  // 1️⃣ Find admin by email
  const result = await dynamoDb.scan({
    TableName: TABLE,
    FilterExpression: "email = :e",
    ExpressionAttributeValues: { ":e": email }
  }).promise();

  if (!result.Items || result.Items.length === 0) {
    throw new Error("Invalid credentials");
  }

  const admin = result.Items[0];

  // 2️⃣ Compare password
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  // 3️⃣ Create JWT for admin
  const token = jwt.sign(
    {
      adminID: admin.adminID,
      role: "ADMIN",
      name: admin.name,
      phone: admin.phone,
      bio: admin.bio,
      profileImage: admin.profileImage
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // 4️⃣ Return response
  return {
    token,
    role: "ADMIN",
    adminID: admin.adminID
  };
};

exports.getAdminProfile = async (adminID) => {
  const result = await dynamoDb.get({
    TableName: TABLE,
    Key: { adminID }
  }).promise();

  if (!result.Item) {
    throw new Error("Admin not found");
  }

  return result.Item;
};

exports.updateAdminProfile = async (adminID, data) => {
  const { name, phone, bio, profileImage } = data;

  await dynamoDb.update({
    TableName: TABLE,
    Key: { adminID },
    UpdateExpression: `
      SET #name = :name,
          #phone = :phone,
          #bio = :bio,
          #profileImage = :profileImage
    `,
    ExpressionAttributeNames: {
      "#name": "name",
      "#phone": "phone",
      "#bio": "bio",
      "#profileImage": "profileImage"
    },
    ExpressionAttributeValues: {
      ":name": name || "",
      ":phone": phone || "",
      ":bio": bio || "",
      ":profileImage": profileImage || ""
    }
  }).promise();

  const updatedAdmin = await dynamoDb.get({
    TableName: TABLE,
    Key: { adminID }
  }).promise();

  const admin = updatedAdmin.Item;

  const token = jwt.sign(
    {
      adminID: admin.adminID,
      role: "ADMIN",
      name: admin.name,
      phone: admin.phone,
      bio: admin.bio,
      profileImage: admin.profileImage
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return {
    token,
    admin
  };
};

