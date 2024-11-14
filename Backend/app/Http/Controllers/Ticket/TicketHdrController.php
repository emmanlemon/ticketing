<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Models\TicketHdr;
use App\Models\TicketStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Services\TicketLogService;
use Illuminate\Support\Facades\Auth;
class TicketHdrController extends Controller
{

    protected $ticketLogServices;

    public function __construct(TicketLogService $ticketLogService)
    {
        $this->ticketLogServices = $ticketLogService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $data = TicketHdr::getTicketLog()->latest();

        if (!Auth::user()->can('Can View Dashboard') || !Auth::user()->hasRole('Supervisor')) {
            $data = $data->where('emp_id' , Auth::user()->id);
        }

        return new JsonResponse(['status' => Response::HTTP_OK, 'data' => $data->get()], Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        $data = TicketHdr::create($request->getTicketHdr());
        TicketStatus::create($request->getTicketStatus($data->id));
        return new JsonResponse(['status' => Response::HTTP_OK, 'data' => $data , 'message' => 'Ticket Created Successfully'], Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    public function updateStatus(Request $request, TicketHdr $ticketHdr): JsonResponse
    {
        $ticketHdr->update($request->all());
        $this->ticketLogServices->log($ticketHdr->id , Auth::user() , $ticketHdr->status);
        return new JsonResponse(['status' => Response::HTTP_OK, 'message' => 'Ticket status updated'], Response::HTTP_OK);
    }

    /**
 * Display the specified ticket by ticket_id.
 */
    public function show(string $ticket_id): JsonResponse
        {
            $ticket = TicketHdr::getSpecificTicket()->where('ticket_id', $ticket_id)->first();

            if (!$ticket) {
                return new JsonResponse(['status' => Response::HTTP_NOT_FOUND, 'message' => 'Ticket not found'], Response::HTTP_NOT_FOUND);
            }

            return new JsonResponse(['status' => Response::HTTP_OK, 'data' => $ticket], Response::HTTP_OK);
        }
    }
