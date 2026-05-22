<?php
// api/backend.php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Read raw JSON input stream
$inputData = json_decode(file_get_contents('php://input'), true);
$history = $inputData['history'] ?? [];

if (empty($history)) {
    echo json_encode(['reply' => 'System received an empty conversation stream.']);
    exit;
}

// Pull environment key safely from the hosting environment
$apiKey = $_ENV['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY') ?? "";

if (empty($apiKey)) {
    echo json_encode(['reply' => 'Configuration error: GEMINI_API_KEY is missing on the server variables tab.']);
    exit;
}

// Fixed stable API target model layout
$apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" . $apiKey;

$payload = [
    "contents" => $history
];

// Execute Google Engine Request via cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 

$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    $result = json_decode($response, true);
    
    if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        $aiReply = $result['candidates'][0]['content']['parts'][0]['text'];
    } else if (isset($result['error']['message'])) {
        $aiReply = "Google Engine Error: " . $result['error']['message'];
    } else {
        $aiReply = "Unrecognized API response structure. Please verify your billing/key parameters.";
    }
    
    echo json_encode(['reply' => $aiReply]);
} else {
    echo json_encode(['reply' => 'Network timeout: Unable to forward traffic to the AI framework.']);
}
?>