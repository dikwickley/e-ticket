import Pass from "../../../../models/Pass.model";
import dbConnect from "../../../../util/db";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        res.status(200).json({ success: true, method: "GET" });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "POST":
      try {
        let email = req.body.email;
        let collegeid = req.body.collegeid;

        console.log({ email, collegeid });

        let _pass = await Pass.create({
          email: email,
          collegeid: collegeid,
          active: true,
        });

        console.log(_pass);
        // res.status(200).json({ success: true, data: _pass });

        let response = await fetch(
          `https://genesis-qrcode-api.herokuapp.com/QRGenerate/ThanganatQRCodeGenerator/${email}/${collegeid}`,
          {
            methods: "GET",
          }
        );
        response = await response.json();

        res
          .status(200)
          .json({ success: true, data: _pass, email_response: response });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const users = await User.find({ username: req.body.username }).remove();
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
