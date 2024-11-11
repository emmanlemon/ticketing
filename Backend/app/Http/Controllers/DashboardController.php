<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Models\TicketHdr;
use App\Constants\GlobalConstants;
use App\Models\Branch;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;

class DashboardController extends Controller
{
    protected $ticketHdr;

    public function __construct(TicketHdr $ticketHdr)
    {
        $this->ticketHdr = $ticketHdr;
    }

    public function __invoke(): JsonResponse
    {
        return response()->json([
            'status' => Response::HTTP_OK,
            'total_ticket' => $this->ticketHdr->count(),
            'total_ticket_count' => $this->getTicketCountsByStatus($this->ticketHdr->get()),
            'total_ticket_branch' => $this->getTicketPerBranch(),
            'total_ticket_category' => $this->getTicketPerCategory(),
            'total_today_created_ticket' =>  $this->getTicketPerDay(),
        ], Response::HTTP_OK);
        // if (Auth::user()->can('Can View Dashboard') && Auth::user()->hasRoles('Admin')) {
        //     return response()->json([
        //         'status' => Response::HTTP_OK,
        //         'total_ticket_count' => $this->getTicketCountsByStatus($this->ticketHdr->get()),
        //         'total_ticket_branch' => $this->getTicketPerBranch(),
        //         'total_ticket_category' => $this->getTicketPerCategory(),
        //         'total_today_created_ticket' =>  $this->getTicketPerDay(),
        //     ], Response::HTTP_OK);
        // } else {
        //     return response()->json([
        //         'status' => Response::HTTP_OK,
        //         'data' => $this->ticketHdr->where('emp_id', Auth::user()->id)->latest()->get(),
        //     ], Response::HTTP_OK);
        // }
    }

    public function getTicketPerDay(): array
    {
        $today = Carbon::now();

        return [
            'total_created' => $this->ticketHdr->whereDate('created_at', $today)->count(),
            'total_open' => $this->ticketHdr->whereDate('created_at', $today)->where('status', GlobalConstants::OPEN)->count(),
            'total_resolved' => $this->ticketHdr->whereDate('created_at', $today)->where('status', GlobalConstants::COMPLETED)->count(),
        ];
    }

    public function getTicketCountsByStatus($data): array
    {
        $statuses = GlobalConstants::getStatusesType();

        $ticketCounts = [];
        foreach ($statuses as $status => $label) {
            $ticketCounts[$label] = $data->filter(function ($item) use ($status) {
                return $item->status == $status;
            })->count();
        }

        $formattedCounts = array_map(function($label, $count) {
            return ['label' => $label, 'value' => $count];
        }, array_keys($ticketCounts), $ticketCounts);

        return $formattedCounts;
    }

    public function getTicketPerCategory(): array
    {
        $ticketsPerCategory = $this->ticketHdr->get()->filter(function ($item) {
            return isset($item->category_id);
        })->groupBy(function ($item) {
            return $item->category_id;
        });

        $totalCountPerCategory = [];
        foreach ($ticketsPerCategory as $categoryId => $tickets) {
            $category = Category::find($categoryId);
            $totalCountPerCategory[] = [
                'category_name' => $category ? $category->category_description : 'Category Does Not Exist',
                'total_tickets' => $tickets->count(),
            ];
        }

        return $totalCountPerCategory;
    }


    public function getTicketPerBranch(): array
    {
        $ticketsWithBranch = $this->ticketHdr->get()
            ->filter(function ($item) {
                return !empty($item->user) && !empty($item->user->branch_id);
            })
            ->groupBy(function ($item) {
                return $item->user->branch_id;
            });

        $totalCountWithBranch = [];
        foreach ($ticketsWithBranch as $branchId => $tickets) {
            $branch = Branch::find($branchId);
            $totalCountWithBranch[] = [
                'branch_name' => $branch ? $branch->branch_description : 'Branch Does Not Exist',
                'total_tickets' => $tickets->count(),
                'status_counts' => $this->getTicketCountsByStatus($tickets)
            ];
        }

        $totalCountWithoutBranch = $this->ticketHdr->get()->filter(function ($item) {
            return !isset($item->user->branch_id);
        })->count();

        return [
            'total_count_with_branch' => $totalCountWithBranch,
            'total_count_without_branch' => $totalCountWithoutBranch,
        ];
    }
}