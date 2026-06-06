import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    // Pemilik pengajuan
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Jenis layanan
    serviceType: {
      type: String,
      required: true,
      enum: [
        "ktp",
        "kk",
        "akta_kelahiran",
        "surat_domisili",
      ],
    },

    // Nomor tracking unik
    trackingCode: {
      type: String,
      unique: true,
    },

    // Status pengajuan
    status: {
      type: String,
      default: "draft",
      enum: [
        "draft",
        "pending_review",
        "approved",
        "rejected",
        "completed",
      ],
    },

    // Catatan dari user
    description: {
      type: String,
      default: "",
    },

    // Catatan admin
    adminNotes: {
      type: String,
      default: "",
    },

    // Daftar dokumen
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Tanggal submit
    submittedAt: {
      type: Date,
      default: null,
    },

    // Tanggal approval
    approvedAt: {
      type: Date,
      default: null,
    },

    // Tanggal selesai
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Application ||
  mongoose.model(
    "Application",
    ApplicationSchema
  );