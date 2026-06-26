import { createContext, useContext, useMemo, useReducer } from 'react'
import {
  reservations, rooms as initialRooms, housekeepingTasks, laundryOrders,
  posOrders, menuItems, kitchenOrders, inventoryItems, purchaseOrders,
  employees, leaveRequests, crmCustomers, fnbEvents, addonServices,
  feedbackEntries, maintenanceTickets, transactions, systemUsers, activityLog,
  guestFolios, guestDeposits, guestRequests,
  crmOffers, crmReferrals, crmSupportTickets, crmCampaigns, customerInteractions,
} from '../data/initialState'
import { nextId } from '../utils/helpers'
import { historyEntry } from '../utils/reservationHelpers'

const StoreContext = createContext(null)

function logActivity(log, action, module, detail) {
  return [{
    id: nextId('LOG-', log),
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    action,
    module,
    detail,
  }, ...log].slice(0, 50)
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESERVATION_CREATE': {
      const rooms = action.payload.rooms?.length ? action.payload.rooms : [action.payload.room]
      const item = {
        ...action.payload,
        id: nextId('RES-', state.reservations),
        rooms,
        room: rooms[0],
        notes: action.payload.notes || '',
        history: action.payload.history || [
          historyEntry('Created', `Booking confirmed — ${rooms.length} room(s)`),
        ],
      }
      return {
        ...state,
        reservations: [item, ...state.reservations],
        activityLog: logActivity(state.activityLog, 'Create', 'Reservation', `${item.guest} — ${rooms.join(', ')}`),
      }
    }
    case 'RESERVATION_UPDATE': {
      const prev = state.reservations.find((r) => r.id === action.id)
      const rooms = action.payload.rooms?.length ? action.payload.rooms : action.payload.room ? [action.payload.room] : prev?.rooms
      const updated = {
        ...action.payload,
        rooms,
        room: rooms?.[0] || action.payload.room,
        history: [
          historyEntry('Modified', action.payload.historyNote || 'Reservation details updated'),
          ...(prev?.history || []),
        ],
      }
      return {
        ...state,
        reservations: state.reservations.map((r) => (r.id === action.id ? { ...r, ...updated } : r)),
        activityLog: logActivity(state.activityLog, 'Update', 'Reservation', action.id),
      }
    }
    case 'ROOM_TRANSFER': {
      const res = state.reservations.find((r) => r.id === action.id)
      if (!res) return state
      const oldRoom = res.room
      const entry = historyEntry(
        action.transferType || 'Room Transfer',
        `${oldRoom} → ${action.newRoom}${action.reason ? ` — ${action.reason}` : ''}`,
      )
      const newRooms = (res.rooms || [oldRoom]).map((rm) => (rm === oldRoom ? action.newRoom : rm))
      return {
        ...state,
        reservations: state.reservations.map((r) => (r.id === action.id ? {
          ...r,
          room: action.newRoom,
          rooms: newRooms,
          history: [entry, ...(r.history || [])],
        } : r)),
        activityLog: logActivity(state.activityLog, 'Room Transfer', 'Reservation', `${res.guest}: ${oldRoom} → ${action.newRoom}`),
      }
    }
    case 'RESERVATION_DELETE':
      return {
        ...state,
        reservations: state.reservations.filter((r) => r.id !== action.id),
        activityLog: logActivity(state.activityLog, 'Delete', 'Reservation', action.id),
      }
    case 'CHECK_IN': {
      const res = state.reservations.find((r) => r.id === action.id)
      if (!res) return state
      const roomNum = res.room.split(' ').pop()
      const hasFolio = state.guestFolios.some((f) => f.reservationId === res.id)
      const newFolio = hasFolio ? null : {
        id: nextId('FOL-', state.guestFolios),
        reservationId: res.id,
        guest: res.guest,
        room: res.room,
        status: 'Open',
        charges: [{
          id: nextId('FC-', []),
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          category: 'Room',
          description: `${res.room} — Check-in`,
          amount: 8500,
          tax: 425,
        }],
        payments: [],
      }
      return {
        ...state,
        reservations: state.reservations.map((r) => (r.id === action.id ? { ...r, status: 'Checked In' } : r)),
        rooms: state.rooms.map((rm) => (rm.number === roomNum ? { ...rm, status: 'Occupied' } : rm)),
        guestFolios: newFolio ? [newFolio, ...state.guestFolios] : state.guestFolios,
        housekeepingTasks: [{
          id: nextId('HK-', state.housekeepingTasks),
          room: res.room,
          task: 'Checkout cleaning (scheduled)',
          assignee: 'Housekeeping Team',
          status: 'Scheduled',
          priority: 'Normal',
        }, ...state.housekeepingTasks],
        transactions: [{
          id: nextId('TXN-', state.transactions),
          type: 'Revenue',
          category: 'Room',
          description: `Check-in folio opened — ${res.guest}`,
          amount: '₹8,500',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        }, ...state.transactions],
        crmCustomers: state.crmCustomers.map((c) => (
          c.name === res.guest ? { ...c, lastStay: 'Today', visits: (c.visits || 0) + 1 } : c
        )),
        activityLog: logActivity(state.activityLog, 'Check-in', 'Front Office', `${res.guest} → ${res.room}`),
      }
    }
    case 'CHECK_OUT': {
      const res = state.reservations.find((r) => r.id === action.id)
      if (!res) return state
      const roomNum = res.room.split(' ').pop()
      return {
        ...state,
        reservations: state.reservations.map((r) => (r.id === action.id ? { ...r, status: 'Checked Out' } : r)),
        rooms: state.rooms.map((rm) => (rm.number === roomNum ? { ...rm, status: 'Dirty' } : rm)),
        housekeepingTasks: [{
          id: nextId('HK-', state.housekeepingTasks),
          room: res.room,
          task: 'Post checkout cleaning',
          assignee: 'Unassigned',
          status: 'Pending',
          priority: 'High',
        }, ...state.housekeepingTasks],
        activityLog: logActivity(state.activityLog, 'Check-out', 'Front Office', `${res.guest} — Finance & HK updated`),
      }
    }
    case 'GENERIC_CREATE':
      return {
        ...state,
        [action.key]: [{ ...action.payload, id: action.payload.id || nextId(action.prefix, state[action.key]) }, ...state[action.key]],
        activityLog: logActivity(state.activityLog, 'Create', action.module, action.detail || action.payload.name || action.payload.guest || ''),
      }
    case 'GENERIC_UPDATE':
      return {
        ...state,
        [action.key]: state[action.key].map((item) => (
          item.id === action.id || item.name === action.id ? { ...item, ...action.payload } : item
        )),
        activityLog: logActivity(state.activityLog, 'Update', action.module, String(action.id)),
      }
    case 'GENERIC_DELETE':
      return {
        ...state,
        [action.key]: state[action.key].filter((item) => item.id !== action.id && item.name !== action.id),
        activityLog: logActivity(state.activityLog, 'Delete', action.module, String(action.id)),
      }
    case 'FOLIO_ADD_CHARGE': {
      const folio = state.guestFolios.find((f) => f.id === action.folioId)
      if (!folio) return state
      const charge = { ...action.payload, id: nextId('FC-', folio.charges) }
      return {
        ...state,
        guestFolios: state.guestFolios.map((f) => (f.id === action.folioId
          ? { ...f, charges: [...f.charges, charge] } : f)),
        activityLog: logActivity(state.activityLog, 'Folio Charge', 'Front Office', `${folio.guest} — ${charge.description}`),
      }
    }
    case 'FOLIO_ADD_PAYMENT': {
      const folio = state.guestFolios.find((f) => f.id === action.folioId)
      if (!folio) return state
      const payment = { ...action.payload, id: nextId('FP-', folio.payments) }
      return {
        ...state,
        guestFolios: state.guestFolios.map((f) => (f.id === action.folioId
          ? { ...f, payments: [...f.payments, payment] } : f)),
        transactions: [{
          id: nextId('TXN-', state.transactions),
          type: 'Revenue',
          category: 'Payment',
          description: `Folio payment — ${folio.guest}`,
          amount: `₹${payment.amount.toLocaleString('en-IN')}`,
          date: payment.date,
        }, ...state.transactions],
        activityLog: logActivity(state.activityLog, 'Folio Payment', 'Front Office', `${folio.guest} — ₹${payment.amount}`),
      }
    }
    case 'DEPOSIT_SAVE': {
      const item = {
        ...action.payload,
        id: action.id || nextId('DEP-', state.guestDeposits),
        balance: Math.max(0, (action.payload.amount || 0) - (action.payload.received || 0)),
      }
      const deposits = action.id
        ? state.guestDeposits.map((d) => (d.id === action.id ? { ...d, ...item } : d))
        : [item, ...state.guestDeposits]
      return {
        ...state,
        guestDeposits: deposits,
        activityLog: logActivity(state.activityLog, action.id ? 'Update' : 'Create', 'Deposit', `${item.guest} — ${item.type}`),
      }
    }
    case 'GUEST_REQUEST_SAVE': {
      const item = {
        ...action.payload,
        id: action.id || nextId('GR-', state.guestRequests),
      }
      const isNew = !action.id
      let hk = state.housekeepingTasks
      let maint = state.maintenanceTickets
      let laundry = state.laundryOrders
      if (isNew) {
        if (item.department === 'Housekeeping') {
          hk = [{
            id: nextId('HK-', hk),
            room: item.room,
            task: `Guest request: ${item.requestType}`,
            assignee: 'Unassigned',
            status: 'Pending',
            priority: item.priority,
          }, ...hk]
        } else if (item.department === 'Maintenance') {
          const roomNum = item.room.split(' ').pop()
          maint = [{
            id: nextId('WO-', maint),
            asset: `Room ${roomNum}`,
            complaint: item.notes || item.requestType,
            priority: item.priority,
            status: 'Open',
            assignee: 'Maintenance Team',
          }, ...maint]
        } else if (item.department === 'Laundry') {
          laundry = [{
            id: nextId('LD-', laundry),
            guest: item.guest,
            room: item.room.split(' ').pop(),
            items: item.requestType,
            service: 'Guest Request',
            status: 'Pickup Scheduled',
            amount: 'TBD',
          }, ...laundry]
        }
      }
      const requests = action.id
        ? state.guestRequests.map((r) => (r.id === action.id ? { ...r, ...item } : r))
        : [item, ...state.guestRequests]
      return {
        ...state,
        guestRequests: requests,
        housekeepingTasks: hk,
        maintenanceTickets: maint,
        laundryOrders: laundry,
        activityLog: logActivity(state.activityLog, isNew ? 'Create' : 'Update', 'Guest Request', `${item.guest} → ${item.department}`),
      }
    }
    case 'CRM_SEND_CAMPAIGN': {
      const campaign = state.crmCampaigns.find((c) => c.id === action.id)
      if (!campaign) return state
      const interaction = {
        id: nextId('INT-', state.customerInteractions),
        customer: campaign.guest,
        type: 'Campaign',
        detail: `${campaign.type} campaign sent — ${campaign.offer}`,
        date: new Date().toLocaleString('en-GB', {
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        }),
        channel: campaign.channel,
      }
      return {
        ...state,
        crmCampaigns: state.crmCampaigns.map((c) => (c.id === action.id ? { ...c, status: 'Sent' } : c)),
        customerInteractions: [interaction, ...state.customerInteractions],
        activityLog: logActivity(state.activityLog, 'Campaign', 'CRM', `${campaign.guest} — ${campaign.type}`),
      }
    }
    case 'CUSTOMER_BOOKING': {
      const booking = {
        id: nextId('CB-', state.customerBookings),
        ...action.payload,
        status: 'Confirmed',
        source: 'Customer Portal',
      }
      const reservation = {
        id: nextId('RES-', state.reservations),
        guest: action.payload.guest,
        source: 'Customer Portal',
        room: action.payload.room,
        rooms: [action.payload.room],
        checkIn: action.payload.checkIn,
        checkOut: action.payload.checkOut,
        checkInIso: action.payload.checkInIso,
        checkOutIso: action.payload.checkOutIso,
        status: 'Confirmed',
        notes: '',
        history: [historyEntry('Created', 'Customer portal booking')],
      }
      return {
        ...state,
        customerBookings: [booking, ...state.customerBookings],
        reservations: [reservation, ...state.reservations],
        activityLog: logActivity(state.activityLog, 'Booking', 'Customer Portal', `${booking.guest} — ERP synced`),
      }
    }
    default:
      return state
  }
}

const initialState = {
  reservations,
  rooms: initialRooms,
  housekeepingTasks,
  laundryOrders,
  posOrders,
  menuItems,
  kitchenOrders,
  inventoryItems,
  purchaseOrders,
  employees,
  leaveRequests,
  crmCustomers,
  fnbEvents,
  addonBookings: addonServices,
  feedback: feedbackEntries,
  maintenanceTickets,
  transactions,
  systemUsers,
  activityLog,
  customerBookings: [],
  customerServiceBookings: [],
  guestFolios,
  guestDeposits,
  guestRequests,
  crmOffers,
  crmReferrals,
  crmSupportTickets,
  crmCampaigns,
  customerInteractions,
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const actions = useMemo(() => ({
    create: (key, prefix, module, payload, detail) =>
      dispatch({ type: 'GENERIC_CREATE', key, prefix, module, payload, detail }),
    update: (key, module, id, payload) =>
      dispatch({ type: 'GENERIC_UPDATE', key, module, id, payload }),
    remove: (key, module, id) =>
      dispatch({ type: 'GENERIC_DELETE', key, module, id }),
    createReservation: (payload) => dispatch({ type: 'RESERVATION_CREATE', payload }),
    updateReservation: (id, payload) => dispatch({ type: 'RESERVATION_UPDATE', id, payload }),
    deleteReservation: (id) => dispatch({ type: 'RESERVATION_DELETE', id }),
    transferRoom: (id, payload) => dispatch({ type: 'ROOM_TRANSFER', id, ...payload }),
    checkIn: (id) => dispatch({ type: 'CHECK_IN', id }),
    checkOut: (id) => dispatch({ type: 'CHECK_OUT', id }),
    addFolioCharge: (folioId, payload) => dispatch({ type: 'FOLIO_ADD_CHARGE', folioId, payload }),
    addFolioPayment: (folioId, payload) => dispatch({ type: 'FOLIO_ADD_PAYMENT', folioId, payload }),
    saveDeposit: (payload, id = null) => dispatch({ type: 'DEPOSIT_SAVE', payload, id }),
    saveGuestRequest: (payload, id = null) => dispatch({ type: 'GUEST_REQUEST_SAVE', payload, id }),
    sendCampaign: (id) => dispatch({ type: 'CRM_SEND_CAMPAIGN', id }),
    customerBookRoom: (payload) => dispatch({ type: 'CUSTOMER_BOOKING', payload }),
    customerBookService: (payload) =>
      dispatch({
        type: 'GENERIC_CREATE',
        key: 'customerServiceBookings',
        prefix: 'CS-',
        module: 'Customer Portal',
        payload: { ...payload, status: 'Booked' },
        detail: payload.service,
      }),
  }), [])

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
