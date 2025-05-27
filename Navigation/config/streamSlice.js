import { createSlice } from '@reduxjs/toolkit';

export const streamSlice = createSlice({
  name: 'streamData',
  initialState: {
    streams: {
      INTERNAL: null,    // Untuk koordinat GPS HP
      GNGGA: null,       // Untuk data GNSS Geodetik
      GNGST: null        // Untuk data tambahan GNSS
    },
    lastUpdated: {
      INTERNAL: null,
      GNGGA: null,
      GNGST: null
    }
  },
  reducers: {
    setStreamData: (state, action) => {
      const { streamId, data } = action.payload;
      state.streams[streamId] = data;
      state.lastUpdated[streamId] = new Date().toISOString();
      console.log(`[Redux] Update stream ${streamId}:`, data);
    },

    clearStreamData: (state, action) => {
      const { streamId } = action.payload;
      delete state.streams[streamId];
      delete state.lastUpdated[streamId];
    },

    clearAllStreams: (state) => {
      state.streams = {
        INTERNAL: null,
        GNGGA: null,
        GNGST: null
      };
      state.lastUpdated = {
        INTERNAL: null,
        GNGGA: null,
        GNGST: null
      };
    },
  },
});

export const { setStreamData, clearStreamData, clearAllStreams } = streamSlice.actions;

// Selector untuk memudahkan akses data
export const selectStreamData = (state, streamId) => state.streamData.streams[streamId];
export const selectLastUpdated = (state, streamId) => state.streamData.lastUpdated[streamId];

export default streamSlice.reducer;