-- THE AJAX CALLBACK PROCESS NAMED "SAVE_EMP"
DECLARE
    l_clob CLOB;
    CURSOR JSD(P_CLOB_C CLOB) IS SELECT jt.*
FROM JSON_TABLE(
    ( P_CLOB_C),
    '$[*]'
    COLUMNS (
        ACTION char PATH '$.ACTION',
        C1 number PATH '$.C1',
        C2 NUMBER PATH '$.C2',
        C3   NUMBER PATH '$.C3'
    )
) jt
order by C1;
BEGIN
    l_clob := apex_application.g_clob_01;
    -- just test receive
FOR I IN JSD(l_clob) LOOP
-- YOUR CODE HERE
  null;
END LOOP;
    COMMIT;
    apex_json.open_object;
    apex_json.write('status', 'success');
    apex_json.close_object;
EXCEPTION
    WHEN OTHERS THEN
        apex_json.open_object;
        apex_json.write('status', 'fail');
        apex_json.write('error', SQLERRM);
        apex_json.close_object;
END;
