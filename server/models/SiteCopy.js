import mongoose from 'mongoose';

const siteCopySchema = new mongoose.Schema(
  {
    heroContent: { type: mongoose.Schema.Types.Mixed, default: {} },
    stats: { type: [mongoose.Schema.Types.Mixed], default: [] },
    services: { type: [mongoose.Schema.Types.Mixed], default: [] },
    roles: { type: [mongoose.Schema.Types.Mixed], default: [] },
    aboutCopy: { type: String, default: '' },
    aboutDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: { principles: [], instruments: [] },
    },
    moreProjects: { type: mongoose.Schema.Types.Mixed, default: {} },
    sectionCopy: { type: mongoose.Schema.Types.Mixed, default: {} },
    contactContent: { type: mongoose.Schema.Types.Mixed, default: {} },
    socials: { type: [mongoose.Schema.Types.Mixed], default: [] },
    footerProfile: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const SiteCopy = mongoose.model('SiteCopy', siteCopySchema);

export default SiteCopy;


