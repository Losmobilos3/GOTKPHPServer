<?php
$url = 'http://127.0.0.1/writeToDB'; // URL of your PHP script
$data = array(
    'timeStamp' => 123456789,
    'eventType' => 'example_event'
);

$options = array(
    'http' => array(
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query($data)
    )
);

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === false) {
    // Handle error
    echo "Error: Unable to send POST request.";
} else {
    // Handle response
    echo "Response: $response";
}
?>