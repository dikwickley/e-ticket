import Event from "../../../models/Event.model";
import dbConnect from "../../../util/db";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const event = await Event.findById(id);
        if (!event) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: event });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    //   case 'PUT' /* Edit a model by its ID */:
    //     try {
    //       const pet = await Pet.findByIdAndUpdate(id, req.body, {
    //         new: true,
    //         runValidators: true,
    //       })
    //       if (!pet) {
    //         return res.status(400).json({ success: false })
    //       }
    //       res.status(200).json({ success: true, data: pet })
    //     } catch (error) {
    //       res.status(400).json({ success: false })
    //     }
    //     break

    //   case 'DELETE' /* Delete a model by its ID */:
    //     try {
    //       const deletedPet = await Pet.deleteOne({ _id: id })
    //       if (!deletedPet) {
    //         return res.status(400).json({ success: false })
    //       }
    //       res.status(200).json({ success: true, data: {} })
    //     } catch (error) {
    //       res.status(400).json({ success: false })
    //     }
    //     break

    default:
      res.status(400).json({ success: false });
      break;
  }
}
