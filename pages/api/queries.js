import { supabase } from "../../lib/supabase";

export async function getProjectItem(projectID) {
  try {
    const contributionsData = await supabase
      .from("contributions")
      .select(
        `
      wallet_id,
      amount_contributed_usd,
      contributor_wallets (
        tags,
        risk_score
      )
    `
      )
      .eq("project_id", projectID);

    const projectData = await supabase
      .from("projects")
      .select(
        `
      title,
      wallet_address,
      gitcoin_url,
      tags,
      risk_score,
      num_contributors,
      total_amount_contributed_usd
    `
      )
      .eq("id", projectID);

    const data = {
      projectData: projectData.data,
      contributionsData: contributionsData.data,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw "query execution failed";
  }
}


export async function getWalletItem(walletID) {
  try {
    
    let { data : projectData } = await supabase.rpc("wallet_projects", { arg_wallet_id: walletID});

    const { data : walletTags } = await supabase
    .from("contributor_wallets")
    .select(
      `
      tags
      `
    )
    .eq("id", walletID);


    return {
      projectData,
      walletTags
    }

  } catch (error) {
    console.log(error);
    throw "query execution failed";
  }
}


export async function getProjects() {
  try {
    let { data } = await supabase.from("projects").select();
    return data;
  } catch (error) {
    console.log(error);
    throw "query execution failed";
  }
}

export async function getWallets() {
  try {
    let walletTags = await supabase.from("contributor_wallets").select(
      `
      id,
      tags,
      risk_score
      `
    );

    console.log(walletTags)

    let { data: walletStats } = await supabase.rpc("wallet_stats");

    
    return {
      walletTags,
      walletStats
    };

  } catch (error) {
    console.log(error);
    throw "query execution failed";
  }
}

export async function getWalletsCount() {
  try {
    let { data } = await supabase.rpc("unique_contributors");
    return data;
  } catch (error) {
    console.log(error);
    throw "query execution failed";
  }
}


export async function getRoundAttributes() {
  try {
    let { data } = await supabase.rpc("round_attributes");
    return data;
  } catch (error) {
    console.log(error);
    throw "query execution failed";
  }
}


export async function getWalletAttributes(projectID='') {
  try {
    let { data } = await supabase.rpc("wallet_attributes_v1", { arg_project_id: projectID});
    return data;
  } catch (error) {
    console.log(error);
    throw "query execution failed";
  }
}